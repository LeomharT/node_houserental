const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require("alipay-sdk/lib/form").default;
const fs = require('fs');
module.exports = class AliPay
{
    constructor(app)
    {
        this.app = app;
        this.aliPaySdk = new AlipaySdk({
            //应用ID
            appId: '2021000118618950',
            //加密方式
            signType: "RSA2",
            //支付宝网关
            gateway: 'https://openapi.alipaydev.com/gateway.do',
            privateKey: fs.readFileSync("./privateKey_RSA2_PKCS1.txt", 'ascii'),
            alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjlBQJQZNuj6ou1u0Us9sHLwh85SsXdcxnfS0toNN6vLU01emqrB2cj7Cv5VZujs0MJdWr1OGxv2utuRJATGc/qHSP25Sgjk7IhKdEWlWxdoYVmrVxvxHUZN8R6haN8NN6bY0EoP29s1wWcCC/7ijXb5yg5i0MvRFKeCXMOnfW4aGmiCbvjQgugx7Oxc3cPpX5iuY1cU8bhbiUWWBLz62eZMR7TGvTQZCHZ/r1vewpxG2cxZ79TVNeD64pJTpVrfKSRVFBMPNgL+wQS1vJ/FomVadit9QZXSJSr0MVNyos2N0Apl56EWsvWADBE3MzF/etxSmnUSeStYXy0q+xAQ1pQIDAQAB",
        });
    }
    PayOrder = () =>
    {
        this.app.post('/PayOrder', async (req, res) =>
        {
            const formData = new AlipayFormData();
            formData.setMethod("get");
            formData.addField('notifyUrl', 'http://localhost:3000/HouseList/ConfirmOrder');
            formData.addField('bizContent', {
                outTradeNo: '15693801273221', // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
                productCode: 'FAST_INSTANT_TRADE_PAY', // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
                totalAmount: '0.01', // 订单总金额，单位为元，精确到小数点后两位
                subject: '商品', // 订单标题
                body: '商品详情', // 订单描述
            });
            formData.addField("resultUrl", 'http://localhost:3000/Home');
            console.log(formData);
            const aliPayUrl = await this.aliPaySdk.exec('alipay.trade.page.pay', {}, { formData });
            res.send(JSON.stringify(aliPayUrl));
        });
    };
};
