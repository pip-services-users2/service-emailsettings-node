import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
export interface IEmailSettingsController {
    getSettingsByIds(correlationId: string, recipientIds: string[]): Promise<EmailSettingsV1[]>;
    getSettingsById(correlationId: string, recipientId: string): Promise<EmailSettingsV1>;
    getSettingsByEmail(correlationId: string, email: string): Promise<EmailSettingsV1>;
    setSettings(correlationId: string, settings: EmailSettingsV1): Promise<EmailSettingsV1>;
    setVerifiedSettings(correlationId: string, settings: EmailSettingsV1): Promise<EmailSettingsV1>;
    setRecipient(correlationId: string, recipientId: string, name: string, email: string, language: string): Promise<EmailSettingsV1>;
    setSubscriptions(correlationId: string, recipientId: string, subscriptions: any): Promise<EmailSettingsV1>;
    deleteSettingsById(correlationId: string, recipientId: string): Promise<void>;
    resendVerification(correlationId: string, recipientId: string): Promise<void>;
    verifyEmail(correlationId: string, recipientId: string, code: string): Promise<void>;
}
