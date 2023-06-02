const stringVerify = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

module.exports = () => {
    let code = "";
    const stringVerifyLength = stringVerify.length;
    for (let i = 0; i < 6; ++i) {
        code += stringVerify[Math.floor(Math.random() * stringVerifyLength)];
    }
    return code;
}