import { Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoDialogService, PoModalAction, PoModalComponent } from '@portinari/portinari-ui';
import { RestJiraService } from '../rest-jira.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { Router } from '@angular/router';

// tslint:disable:member-ordering
// tslint:disable:max-line-length
// tslint:disable:no-eval


@Component({
  selector: 'app-indperfprime',
  templateUrl: './indperfprime.component.html',
  styleUrls: ['./indperfprime.component.css'],
  providers: [RestJiraService]
})
export class IndperfprimeComponent implements OnInit {

  @ViewChild(PoModalComponent, {static: false}) thfModal: PoModalComponent;

  loadButton = false;
  isHideLoading = true;
  labelButton = 'Gerar Indicadores';
  colperf: Array<PoTableColumn>;
  itemsperf: Array<any>;
  // Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<any>;
  categchartPerf = [[], [], [], [], [], [], [], [], [] ];
  serieschartPerf = [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]];
  usuarios: Array<any>;
  jqlFiltro: Array<any>;
  startDate: Date;
  endDate: Date;
  timeini = ' 00:00';
  timeFim = ' 23:59';
  diasUteis: number;
  now: Date;
  columnsGrid: Array<any>;
  itemsGrid: Array<any>;



  constructor(
    public restJiraService: RestJiraService,
    private router: Router,
    private thfAlert: PoDialogService) { }

  ngOnInit() {

    this.columnsGrid = this.getColumns();
    this.now = new Date();

    const diaIni = 1;
    const diaFim = this.now.getDate();
    const mes = this.now.getMonth();
    const ano = this.now.getFullYear();

    this.startDate = new Date(ano, mes, diaIni);
    this.endDate = new Date(ano, mes, diaFim);
    this.limpaTabela();

    this.usuarios = [
      { user: 'eduardo.martinez', total: 0, label: 'Eduardo Martinez'  },
      { user: 'evandro.pattaro', total: 0 , label: 'Evandro Pattaro' },
      { user: 'igor.bigois', total: 0 , label: 'Guilherme Bigois' },
      { user: 'guilherme.fernando', total: 0 , label: 'Fernando Luis' },
      { user: 'julio.silva', total: 0, label: 'Julio Silva'  },
      { user: 'luis.fernando', total: 0 , label: 'Luís Magalhães' },    
      { user: 'vitor.pires', total: 0 , label: 'Vitor Pires' },
      { user: 'wesley.lossani', total: 0 , label: 'Wesley Lossani' },
      { user: 'oliveira.eder', total: 0 , label: 'Eder Oliveira' }

    ];

    // Chart1
    this.categchart1 = this.getCategchart1();
  }

  //
  // Verifica se sessão do usuario está ativa
  //
  validaSessao() {

    this.loadButton = true;

    this.restJiraService.autenticar().subscribe(data => {
      this.gerarIndicadores();
    }, error => {
      this.thfAlert.alert({title: 'Sessão encerrada!', message: 'Por favor, refaça o login.', ok: () => this.router.navigate(['/login']) });
    });

  }

  gerarIndicadores() {

    if ( (this.startDate === undefined || this.endDate === undefined) || (this.startDate.toString() === '' || this.endDate.toString() === '') ) {
      this.thfAlert.alert({title: 'Campos obrigatorios!', message: 'Preencha os campos de período.'});
      return;
    }
    this.isHideLoading = false;
    this.labelButton = 'Gerando indicadores...';

    this.limpaTabela();

    const dataDe = new Date(this.startDate);
    const dataAte = new Date(this.endDate);
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter('59157').subscribe(response => this.getPerf(response.jql, 'Retrabalho'));
    this.restJiraService.getFilter('59150').subscribe(response => this.getPerf(response.jql, 'Codificadas'));
    this.restJiraService.getFilter('59154').subscribe(response => this.getPerf(response.jql, 'Rejeitadas'));
    this.restJiraService.getFilter('59155').subscribe(response => this.getPerf(response.jql, 'Canceladas'));

  }

   getPerf(filtro, campo) {

      let filtroEdit = filtro;
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, 'startOfMonth()', '\'' + this.startDate.toString().substring(0, 10) + this.timeini + '\'', true);
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, 'endOfMonth()', '\'' + this.endDate.toString().substring(0, 10) + this.timeFim + '\'', true);

      this.restJiraService.getIssues(filtroEdit).subscribe( response => {
        const fimExecucao = this.restJiraService.atualizaPerf(response, this.itemsperf, this.usuarios, campo, this.diasUteis);
        if (fimExecucao) {
          this.atualizaGrafico();
       } } );
  }

  limpaTabela() {
    const zeraGrafico = [0, 0, 0, 0, 0, 0, 0, 0];
    this.itemsperf = [
        { analista: 'Eduardo Martinez', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Evandro Pattaro', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Guilherme Bigois', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Fernando Luis', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Julio Silva', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Luís Magalhães', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Vitor Pires', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Wesley Lossani', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0},
        { analista: 'Eder Oliveira', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho: 0, produtividade: 0}
      ];

  this.colperf = [
    { property: 'analista', label: 'Analista'},
    { property: 'codificadas', label: 'Codificadas', type: 'number'},
    { property: 'rejeitadas', label: 'Rejeitadas', type: 'number'},
    { property: 'canceladas', label: 'Canceladas', type: 'number'},
    { property: 'retrabalho', label: 'Retrabalho', type: 'number' },
    ];

    this.serieschart1 = this.getSeriesChart1(zeraGrafico, zeraGrafico, zeraGrafico);
    for (let _i = 0; this.serieschartPerf.length > _i; _i++) {
      this.serieschartPerf[_i] = this.getSeriesChart2(0, 0, 0, 0, 0);
    }

  }

  atualizaGrafico() {

    const dadosRet = [0, 0, 0, 0, 0, 0, 0, 0];
    const dadosTrab = [0, 0, 0, 0, 0, 0, 0, 0];
    const dadosProd = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let _i = 0; this.serieschartPerf.length > _i; _i++) {
        this.serieschartPerf[_i] = this.getSeriesChart2(this.itemsperf[_i].Codificadas.total, this.itemsperf[_i].Rejeitadas.total, this.itemsperf[_i].Canceladas.total,
        this.itemsperf[_i].Retrabalho.total, this.itemsperf[_i].percretrabalho.total);
    }

    for (let _a = 0; this.itemsperf.length > _a; _a++) {
       dadosRet[_a] = this.itemsperf[_a].percretrabalho;
       dadosTrab[_a] = this.itemsperf[_a].Codificadas.total + this.itemsperf[_a].Rejeitadas.total;
       dadosProd[_a] = this.itemsperf[_a].produtividade;
       this.itemsperf[_a].percretrabalho = this.itemsperf[_a].percretrabalho.toString() + '%';
       this.itemsperf[_a].produtividade = this.itemsperf[_a].produtividade.toString() + '%';
    }
    this.serieschart1 = this.getSeriesChart1(dadosRet, dadosTrab, dadosProd);
    this.loadButton = false;
    this.isHideLoading = true;
    this.labelButton = 'Gerar Indicadores';

  }

  openModal(formData, usuario) {

    if (this.restJiraService.detectarMobile()) {
      return;
    }

    this.itemsGrid = [];
    for (let _i = 0; this.itemsperf.length > _i; _i++) {
      if (this.itemsperf[_i].analista === usuario) {
        for (let _x = 0; eval('this.itemsperf[_i].' + formData.series.name + '.issues.length') > _x; _x++) {
          this.itemsGrid.push({
            issue:    eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].key'),
            nomeFant: eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.customfield_11071.value'),
            summary: eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.summary'),
            sla:      this.restJiraService.formatDate(eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.customfield_11080')),
            dtAcordo: this.restJiraService.formatDate(eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.customfield_11039')),
            dtPSLA:   this.restJiraService.formatDate(eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.customfield_11040')),
            reporter: eval('this.itemsperf[_i].' + formData.series.name + '.issues[_x].fields.reporter.displayName')
          });
        }
      }
    }
    this.thfModal.open();
  }

  private getSeriesChart1(dadosRet, dadosTrab, dadosProd): Array<any> {
    return [
      { name: 'Issues Trabalhadas', data: dadosTrab },
      { name: '% Produtividade', data: dadosProd },
      { name: '% Retrabalho', data: dadosRet},
      ];
  }
  private getSeriesChart2(dadosCod, dadosRej, dadosCanc, dadosRet, dadosPercRet): Array<any> {
    return [
      { name: 'Codificadas', data: [dadosCod]},
      { name: 'Canceladas', data: [dadosCanc] },
      { name: 'Rejeitadas', data: [dadosRej] },
      { name: 'Retrabalho', data: [dadosRet] },
    ];
  }
  private getCategchart1(): Array<string> {
    return [ 'Eduardo Martinez', 'Evandro Pattaro', 'Guilherme Bigois', 'Fernando Luis',
    'Julio Silva', 'Luís Magalhães', 'Vitor Pires', 'Wesley Lossani', 'Eder Oliveira' ];
  }

  primaryAction: PoModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Fechar'
  };

  getColumns(): Array<any> {
    return [
      { column: 'issue', label: 'Issue', type: 'string', width: 18},
      { column: 'nomeFant', label: 'Nome Fantasia', type: 'string', width: 27},
      { column: 'summary', label: 'Summary' , type: 'string', width: 31},
      { column: 'sla', label: 'SLA', type: 'date', width: 13},
      { column: 'dtAcordo', label: 'Dt. Acordo', type: 'date', width: 13},
      { column: 'dtPSLA', label: 'Pausa SLA', type: 'date', width: 13},
      { column: 'reporter', label: 'Reporter', type: 'string', width: 15 }
    ];
  }
}
