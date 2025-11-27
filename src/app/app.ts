import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RandomUserService } from './services/random-user.service';
import { AuditStorageService } from './services/audit-storage.service';
import { User, AuditRecord } from './models/audit.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('El Auditor de Usuarios');
  
  userCount = signal<number>(12);
  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>('');
  auditedUserIds = signal<string[]>([]);

  constructor(
    private randomUserService: RandomUserService,
    private auditStorageService: AuditStorageService
  ) {}

  ngOnInit(): void {
    this.loadAuditedUsers();
  }

  loadUsers(): void {
    if (this.userCount() <= 0) {
      this.error.set('Por favor ingrese un número mayor a 0');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.users.set([]);

    this.randomUserService.getUsers(this.userCount()).subscribe({
      next: (response) => {
        this.users.set(response.results);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getBorderStyle(age: number): string {
    return age < 30 ? '3px solid green' : '3px solid red';
  }

  getBorderClass(age: number): string {
    return age < 30 ? 'border-green' : 'border-red';
  }

  getFormattedDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return '${day}/${month}/${year}';
  } 

  toggleAudit(user: User): void {
    const auditRecord: AuditRecord = {
      id_interno: user.id.value,
      nombre_reporte:' ${user.name.last}, ${user.name.first}',
      fecha_auditoria: this.getFormattedDate()
    };

    const isNowAudited = this.auditStorageService.addOrRemoveAuditRecord(auditRecord);
    this.updateAuditedUserIds();

    if (isNowAudited) {
      console.log('Usuario ${auditRecord.nombre_reporte} añadido a auditoría');
    } else {
      console.log('Usuario ${auditRecord.nombre_reporte} removido de auditoría');
    }
  }

  isUserAudited(userId: string): boolean {
    return this.auditedUserIds().includes(userId);
  }

  loadAuditedUsers(): void {
    const records = this.auditStorageService.getAuditRecords();
    this.auditedUserIds.set(records.map(r => r.id_interno));
  }

  updateAuditedUserIds(): void {
    this.loadAuditedUsers();
  }

  getAuditButtonText(userId: string): string {
    return this.isUserAudited(userId) ? 'Desmarcar' : 'Auditar';
  }

}
