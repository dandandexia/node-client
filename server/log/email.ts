import logger from './index'

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    sercure: true,
    auth: {
        user: 'monitor-sender@xx.com',
        pass: '***'
    }
})


export default function sendMail(err) {
    let options = {
        from: 'test <monitor-sender@xx.com>',
        to: '**@**.com',
        subject: '【前端监控】node-client', // 标题
        html: err // 内容
    }
    return transporter.sendMail(options, (error, info) => {
            if (error) {
                logger.info('发送邮件失败');
            }
        })
}