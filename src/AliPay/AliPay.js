import AlipaySdk from 'alipay-sdk';

export default class AliPay
{
    constructor(app)
    {
        this.app = app;
        console.log(AlipaySdk);
        // this.aliPaySdk = new AlipaySdk({
        //     app='1'
        // });
    }
}
