
const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'navaro.kim@marriott.com',
		subject: 'Thanks for joining in!',
		text: `Welcome to the app, ${name}. Let me know what you think of the map.`
	})
}

const sendCancelEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'navaro.kim@marriott.com',
		subject: 'Thanks for joining in!',
		text: `Sorry to see that your leaving, ${name}. Hope you enjoyed using the app.`
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancelEmail

}

/*sgMail.send({
	to:'navaro.kim@marriott.com',
	from:'navaro.kim@marriott.com',
	subject: 'Testing SendGrid email',
	text: 'Hope this works'

})*/
