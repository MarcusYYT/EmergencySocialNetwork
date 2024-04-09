import { Preference } from "../models/Preference.model.js";

export async function upsertPreference(userId, email, trigger, announcementUpdate, privatePostUpdate, publicPostUpdate, statusChanges) {
    return await Preference.setPreferences(userId, email, trigger, announcementUpdate, privatePostUpdate, publicPostUpdate, statusChanges);
  }