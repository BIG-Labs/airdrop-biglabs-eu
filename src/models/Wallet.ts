import { Chain } from "./Chain";

export type WalletId = 'metamask' | string;

export type Wallet = {
    id: WalletId,
    name: string,
    icon: string,
    chains: Array<Chain>
}

