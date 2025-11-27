import { Injectable } from '@angular/core';
import { AuditRecord } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditStorageService {
  private readonly STORAGE_KEY = 'lista_auditoria';

  constructor() {}

  getAuditRecords(): AuditRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveAuditRecords(records: AuditRecord[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }

  addOrRemoveAuditRecord(record: AuditRecord): boolean {
    const records = this.getAuditRecords();
    const existingIndex = records.findIndex(r => r.id_interno === record.id_interno);

    if (existingIndex >= 0) {
      records.splice(existingIndex, 1);
      this.saveAuditRecords(records);
      return false;
    } else {
      records.push(record);
      this.saveAuditRecords(records);
      return true;
    }
  }

  isUserInAudit(userId: string): boolean {
    const records = this.getAuditRecords();
    return records.some(r => r.id_interno === userId);
  }

  clearAllRecords(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
