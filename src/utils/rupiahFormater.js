export default function rupiah(number) {
    let price = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(number);

    return price.split(",")[0];
}
