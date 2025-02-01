export default function formatToIDR(value) {
    if (value >= 1000) {
        return `>IDR ${(value / 1000).toFixed(0)}K`;
    }
    return `IDR ${value}`;
}