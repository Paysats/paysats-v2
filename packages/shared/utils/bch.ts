/**
 * format bch amount from satoshis to BCH string
 */
export const formatBCH = (satoshis: number, decimals = 8): string => {
    const bchAmount = satoshis / 1e8;
    return bchAmount.toFixed(decimals);
};

/**
 * parse BCH string to satoshis
 */
export const parseBCH = (bchString: string): number => {
    const bchAmount = parseFloat(bchString);
    return Math.round(bchAmount * 1e8);
};