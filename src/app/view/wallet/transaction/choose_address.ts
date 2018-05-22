/**
 * 选择地址
 */
import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet, wei2Eth, decrypt, setLocalStorage } from "../../../utils/tools";
import { Api } from "../../../core/eth/api";
import { GaiaWallet } from "../../../core/eth/wallet";

interface Props {
    currencyName: string;
}

export class AddAsset extends Widget {
    public props: Props;
    public ok: () => void;

    constructor() {
        super();
    }
    public setProps(props: Props, oldProps: Props): void {
        super.setProps(props, oldProps);
        this.init();
    }

    public init(): void {
        this.state = {};

        this.getAddrs()
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理选择地址
     */
    public chooseAddr(e, index) {
        if (!this.state.list[index].isChoose) {
            let wallets = getLocalStorage("wallets");
            const wallet = getCurrentWallet(wallets);
            let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
            if (currencyRecord) {
                currencyRecord.currentAddr = this.state.list[index].addr;
                setLocalStorage("wallets", wallets, true);
            }
        }
        this.doClose()
    }

    /**
     * 处理添加地址
     */
    public addAddr(e, index) {
        let api = new Api();
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);
        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0];
        if (!currencyRecord) return
        let gwlt = GaiaWallet.fromJSON(wallet.gwlt);
        let newGwlt = gwlt.selectAddress(decrypt(wallet.walletPsw), this.state.list.length)

        // r.toJSON()

        popNew("pi-components-message-messagebox", { type: "prompt", title: "添加地址", content: newGwlt.address }, (r) => {
            currencyRecord.addrs.push({
                addr: newGwlt.address,
                addrName: r ? r : `默认地址${this.state.list.length}`,
                gwlt: newGwlt.toJSON(),
                record: []
            });
            currencyRecord.currentAddr = newGwlt.address;
            setLocalStorage("wallets", wallets, true);
            console.log(wallets)
            //todo 这里验证输入，并根据输入添加地址，且处理地址切换
            this.doClose();
        }, () => {
            this.doClose();
        })
    }

    private getAddrs() {
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);

        if (!wallet.currencyRecords || !this.props.currencyName) return [];

        let currencyRecord = wallet.currencyRecords.filter(v => v.currencyName === this.props.currencyName)[0]
        if (!currencyRecord) return [];

        let currentAddr = currencyRecord.currentAddr || wallet.walletId;
        let api = new Api();
        this.state.list = currencyRecord.addrs.map(v => {
            let r: any = api.getBalance(v.addr);
            let num = 0
            if (this.props.currencyName === "ETH") {
                num = wei2Eth(r.toNumber());
            }
            return {
                name: v.addrName || "默认地址",
                balance: num,
                isChoose: v.addr === currentAddr,
                addr: v.addr
            }
        })
    }

}