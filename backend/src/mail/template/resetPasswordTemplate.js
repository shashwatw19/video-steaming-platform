function resetPasswordTemplate(resetPasswordToken){
    return  `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <a href="http://localhost:3000/resetpassword/${resetPasswordToken}" style="background-color: #3232ee; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>This link will expire in 10 minutes.</p>
    <br>
    <p>Best Regards,</p>
    <p>Playzone Team</p>
  `
}

export {resetPasswordTemplate}