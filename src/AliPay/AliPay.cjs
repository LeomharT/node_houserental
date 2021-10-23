const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require("alipay-sdk/lib/form").default;
const fs = require('fs');
const multiparty = require('multiparty');
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
            privateKey: fs.readFileSync("./AliPayRSA2/privateKey_RSA2_PKCS1.txt", 'ascii'),
            alipayPublicKey: fs.readFileSync('./AliPayRSA2/aliPayPublicKey_RSA2_PKCS1.txt', 'ascii'),
        });
    }
    OpenAliPayPage = () =>
    {
        this.app.post('/OpenAliPayPage', async (req, res) =>
        {
            //不解析FormData如果是JSON数据直接在body里🐂
            const orderInfo = req.body;
            const formData = new AlipayFormData();
            formData.setMethod("get");
            //支付成功主动推送到指定的地址
            formData.addField('notifyUrl', 'http://47.107.42.46:3065/IsPaymentSuccess');
            //支付完成后返回的界面
            formData.addField("returnUrl", 'http://localhost:3000/PaymentSuccess');
            formData.addField('bizContent', {
                // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复,订单号如果相同则继续去支付
                outTradeNo: orderInfo.orderId,
                // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
                productCode: 'FAST_INSTANT_TRADE_PAY',
                // 订单总金额，单位为元，精确到小数点后两位
                totalAmount: orderInfo.finalRent,
                // 订单标题
                subject: '优区生活房源预定',
                // 订单描述
                body: `${orderInfo.housebaseInfo.hTitle}-
                ${orderInfo.housebaseInfo.hRegion}-
                ${orderInfo.housebaseInfo.hMethod} x
                ${orderInfo.checkInMonth}月`,
                //商品标题
                subject: orderInfo.housebaseInfo.hTitle,
            });
            const aliPayUrl = await this.aliPaySdk.exec('alipay.trade.page.pay', {}, { formData });
            if (aliPayUrl)
                res.send(JSON.stringify(aliPayUrl));
        });
    };
    CheckOrderPaymentStatus = () =>
    {
        this.app.post("/CheckOrderPaymentStatus", async (req, res) =>
        {
            const orderInfo = req.body;
            const formData = new AlipayFormData();
            formData.setMethod("get");
            formData.addField('bizContent', {
                outTradeNo: orderInfo.orderId,
            });
            const orderStatus = await this.aliPaySdk.exec("alipay.trade.query", {}, { formData });
            res.send(orderStatus);
            res.end();
        });
    };
    OrderRefund = () =>
    {
        this.app.post('/OrderRefund', async (req, res) =>
        {
            const reqJson = req.body;
            const formData = new AlipayFormData();
            formData.setMethod('get');
            formData.addField('bizContent', {
                //哪一笔订单号需要退款,可以是自己定义的也可以是支付宝那边生成的(不过好像只能填支付宝给的)
                tradeNo: reqJson.tradeNo,
                //退款金额,不能超过订单金额
                refundAmount: parseInt(reqJson.refundAmount),
                //退款的订单号
                outRequestNo: reqJson._RefundOrderId,
            });
            const refundStatus = await this.aliPaySdk.exec('alipay.trade.refund', {}, { formData });
            if (refundStatus)
            {
                res.send(refundStatus);
                res.end();
            }
        });
    };
};
