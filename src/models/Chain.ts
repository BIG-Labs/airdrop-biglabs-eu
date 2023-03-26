export type ChainId = 'avax' | 'polygon' | 'fantom' | 'bsc' | string;

export type Chain = {
    id: ChainId,
    name: string,
    icon: string
}