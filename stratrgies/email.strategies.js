import * as emailService from '../services/emailService.js'

export const emailStrategies = {
    'PublicPost': (email, sender, content) => emailService.sendPublicPostUpdateEmail(email, sender, content),

};