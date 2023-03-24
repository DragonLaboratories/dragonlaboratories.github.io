export async function download(url) {
    let resp = await fetch(url);
    return resp.text();
}