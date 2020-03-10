import { Component, OnInit } from '@angular/core';
import { PoDialogService, PoPieChartSeries, PoInfoOrientation } from '@portinari/portinari-ui';
import { RestZenService } from '../rest-zen.service';
import { RestJiraService } from '../rest-jira.service';
import { RestTrelloService } from '../rest-trello.service';
import { LegendLabelsContentArgs } from '@progress/kendo-angular-charts';
import { IntlService } from '@progress/kendo-angular-intl';

// tslint:disable:triple-equals
// tslint:disable:no-shadowed-variable
// tslint:disable:no-inferrable-types
// tslint:disable:no-eval


@Component({
  selector: 'app-indcliente',
  templateUrl: './indcliente.component.html',
  styleUrls: ['./indcliente.component.css']
})
export class IndclienteComponent implements OnInit {

  labelButton = 'Gerar Indicadores';
  idCliente = '';
  clientesTrello: Array<any> = [];
  categVolTicSem = ['Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  serVolTicSem = [
    {name: 'Abertos', data: [3, 5, 6, 16, 4, 22]},
    {name: 'Fecahdos', data: [3, 7, 6, 16, 4, 22]}
  ];
  categVolTicAbMes = [
    '02/12/19',
    '03/12/19',
    '10/12/19',
    '12/12/19',
    '13/12/19',
    '16/12/19',
    '17/12/19',
    '18/12/19',
    '19/12/19',
    '20/12/19',
    '27/12/19',
    '30/12/19',
    '31/12/19'
  ];
  serVolTicAbMes = [{data: [2, 2, 2, 4, 1, 1, 1, 2, 1, 1, 3, 1, 1]}];
  catTicAbSouMesC = ['Baixa', 'Normal', 'Urgente'];
  serTicAbSouMesC = [
    {name: 'Abertos', data: [8, 1, 13]},
    {name: 'Fechados', data: [8, 1, 13]}
  ];

  catTicAbSouMesT = ['BUG', 'Dúvida', 'Melhoria'];
  serTicAbSouMesT = [
    {name: 'Abertos', data: [5, 14, 3]},
    {name: 'Fechados', data: [5, 14, 3]}
  ];

  catTicAbSouMesM = [
    'Arquivos Magnéticos (SIGAFIS)',
    'Ativo Fixo (SIGAATF)',
    'Escrituração e Relatórios Fiscal (SIGAFIS)',
    'Faturamento (SIGAFAT)',
    'Gestão de Pessoas (SIGAGPE)',
    'Nota Fiscal Eletrônica de Serviço (NFSE)',
    'Ponto Eletrônico (SIGAPON)',
    'Sistema de Didelização e Análise de Crédito (SIGACRD)',
    'TOTVS SPED SERVICE'];
  serTicAbSouMesM = [
    {name: 'Abertos', data: [1, 1, 1, 1, 14, 1, 1, 1, 1]},
    {name: 'Fechados', data: [1, 1, 1, 1, 14, 1, 1, 1, 1]}
  ];

  catCurvaHistSem = ['março', 'Abril', 'Maio', 'junho', 'Julho', 'Agosto'];
  serCurvaHistSem = [
    {data: [90, 89, 85, 97, 99, 95]}
  ];

  dataBackLogGeral = [
    {category: 'Atendimento', value: 5},
    {category: 'Desenvolvimento', value: 2},
    {category: 'Melhoria', value: 1},
    {category: 'Resolvido - validação cliente', value: 18},
  ];

  catBackLogMod = [
    'TOTVS Automação Fiscal (TAF)',
    'Financeiro (SIGAFIN)',
    'Faturamento (SIGAFAT)',
    'Portal RHONLINE',
    'Gestão de Pessoas (SIGAGPE)',
    'Estoque Custos (SIGAEST)',
    'Escrituração e Relatórios Fiscal (SIGAFIS)',
    'Arquivos Magnéticos (SIGAFIS)',
    'Rotina Automática (ROT Automática)',
    'Nota Fiscal Eletrônica (NFE)',
    'Customizações (ADVPL)',
    'Configurador (SIGACFG)',
    'Compras (SIGACOM)',
    'Call Center (SIGATMK)'
  ];

  serBackLogMod = [
    {stack: 'Atendimento', data: [0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1]},
    {stack: 'Desenvolvimento', data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
    {stack: 'Melhoria', data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    {stack: 'Resolvido - validação cliente', data: [4, 2, 1, 1, 2, 2 , 1 , 1, 1, 1, 1, 0, 1, 0]}
  ];

  CatBackLogCritSta = [ 'Aberto', 'Em Espera', 'Novo', 'Pendente Cliente'];

  serBackLogCritSta = [
    {name: 'Baixa', data: [3, 0, 1, 1]},
    {name: 'Normal', data: [2, 1, 1, 5]},
    {name: 'Alta', data: [4, 1, 0, 1]},
    {name: 'Urgente', data: [2, 2, 0, 2]},
  ];

  dataPiePesquisa = [
    {category: 'Bad', value: 1},
    {category: 'Good', value: 21},
  ];

  totalPesq = '22 Pesquisas eviadas';

  itensPesq = [
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Bad'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'},
    {ticket_id : 7657945, atribuido: 'JARDSON DARDEL', good: 'Good'}
  ];

  columnsPesq = [
    { property: 'ticket_id', label: 'Ticket Id', type: 'string', width: 8},
    { property: 'atribuido', label: 'Atribuído', type: 'string', width: 27},
    { property: 'good', label: 'Ticket Satisfaction' , type: 'string', width: 6}
  ];

  constructor(private restZenService: RestZenService,
    private restJiraService: RestJiraService,
    private restTrelloService: RestTrelloService,
    private thfAlert: PoDialogService,
    private intl: IntlService) {
      this.labelBackLgGer = this.labelBackLgGer.bind(this);
    }

  ngOnInit() {

    this.restZenService.getToken();
    this.getClientes();
  }

  getClientes() {

    this.restTrelloService.buscaClientes().subscribe(response => {
      for (let _i = 0; response.length > _i; _i++) {
        this.clientesTrello.push({ label: response[_i].name, value: response[_i].id });
      }
    }, error => { });
  }

  setCliente(idCliente) {
    this.idCliente = idCliente;
  }

  public labelBackLgGer(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.value} (${this.intl.formatNumber(args.percentage, 'p1')})`;
  }

  public labelBkackLgMod(args: LegendLabelsContentArgs): boolean {
    return (args.value > 0 ? true : false);
  }
}
