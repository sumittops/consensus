export const extractVariables = (text) => {
    const list = [];
    const reg = /{{\s*([^}]+)\s*}}/g;
    let item;
    while((item = reg.exec(text))) {
        list.push(item[1]);
    }
    return list;
}