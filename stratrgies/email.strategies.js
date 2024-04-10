import * as emailService from '../services/emailService.js'

export const emailStrategies = {
    'PublicPost': (email, sender, content) => emailService.sendPublicPostUpdateEmail(email, sender, content),
    'PrivatePost': (email, sender, content) => emailService.sendPrivatePostUpdateEmail(email, sender, content),
    'Announcement': (email, sender, content) => emailService.sendAnnouncementUpdateEmail(email, sender, content),
};