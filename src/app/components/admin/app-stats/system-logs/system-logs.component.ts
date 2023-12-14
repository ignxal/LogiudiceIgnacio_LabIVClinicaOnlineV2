import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss'],
})
export class SystemLogsComponent implements OnInit {
  logs: any;
  constructor(
    public authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.authService.getLogs().subscribe({
      next: (logs: any) => {
        this.logs = logs;
        this.loaderService.hide();
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Operación erronea!',
          text: 'Error al cargar datos',
        });
        this.loaderService.hide();
      },
    });
  }

  downloadData() {
    var table_elt = document.getElementById('logs-table');
    var workbook = XLSX.utils.table_to_book(table_elt);
    var ws = workbook.Sheets['Sheet1'];
    XLSX.utils.sheet_add_aoa(ws, [['Created ' + new Date().toISOString()]], {
      origin: -1,
    });
    XLSX.writeFile(workbook, 'logs-usuarios.xlsx');
  }
}
