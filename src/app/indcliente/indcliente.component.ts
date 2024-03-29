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

  mostraGraficos = false;
  loadButton = false; // loading do botão Gerar Indicadores
  labelButton = 'Gerar Indicadores'; // Label do botão Gerar Indicadores
  startDate: Date; // Data preenchida no campo Mês/Ano de Referência
  startMonth = ''; // Mês inicial da busca
  startYear = ''; // Ano inicial da busca
  idCliente = ''; // Código do cliente digitado no campo Cliente
  clientesEmpodera: Array<any> = []; // Clientes retornados da API do Empodera
  meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  totTicketMesAb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Total de tickts abertos por mês
  totTicketMesFe = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Total de tickts fechados por mês
  categVolTicSem = []; // Categoria chart Volumetria Tickets no Semestre
  serVolTicSem = [
    {name: 'Abertos', data: [3, 5, 6, 16, 4, 22]},
    {name: 'Fecahdos', data: [3, 7, 6, 16, 4, 22]}
  ]; // Serie chart Volumetria Tickets no Semestre
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
  ]; // Categoria chart Volumetria Tickets Abertos Mês - Por dia
  serVolTicAbMes = [{data: [2, 2, 2, 4, 1, 1, 1, 2, 1, 1, 3, 1, 1]}]; // Serie chart Volumetria Tickets Abertos Mês - Por dia
  catTicAbSouMesC = []; // Categoria chart Tickets Abertos e Solucionados no Mês - Críticidade
  serTicAbSouMesC = [
    {name: 'Abertos', data: []},
    {name: 'Fechados', data: []}
  ]; // Serie chart Tickets Abertos e Solucionados no Mês - Críticidade

  catTicAbSouMesT = ['BUG', 'Dúvida', 'Melhoria']; // Categoria chart Tickets Abertos e Solucionados no Mês - Tipo
  serTicAbSouMesT = [
    {name: 'Abertos', data: [5, 14, 3]},
    {name: 'Fechados', data: [5, 14, 3]}
  ]; // Serie chart Tickets Abertos e Solucionados no Mês - Críticidade

  catTicAbSouMesM = [
    'Arquivos Magnéticos (SIGAFIS)',
    'Ativo Fixo (SIGAATF)',
    'Escrituração e Relatórios Fiscal (SIGAFIS)',
    'Faturamento (SIGAFAT)',
    'Gestão de Pessoas (SIGAGPE)',
    'Nota Fiscal Eletrônica de Serviço (NFSE)',
    'Ponto Eletrônico (SIGAPON)',
    'Sistema de Didelização e Análise de Crédito (SIGACRD)',
    'TOTVS SPED SERVICE']; // Categoria chart Tickets Abertos e Solucionados no Mês - Por módulo
  serTicAbSouMesM = [
    {name: 'Abertos', data: [1, 1, 1, 1, 14, 1, 1, 1, 1]},
    {name: 'Fechados', data: [1, 1, 1, 1, 14, 1, 1, 1, 1]}
  ]; // Serie chart Tickets Abertos e Solucionados no Mês - Por módulo

  catCurvaHistSem = ['março', 'Abril', 'Maio', 'junho', 'Julho', 'Agosto']; // Categoria chart Tickets Curva Histórica - Semestral
  serCurvaHistSem = [
    {data: [90, 89, 85, 97, 99, 95]}
  ]; // Serie chart Tickets Curva Histórica - Semestral

  dataBackLogGeral = [
    {category: 'Atendimento', value: 5},
    {category: 'Desenvolvimento', value: 2},
    {category: 'Melhoria', value: 1},
    {category: 'Resolvido - validação cliente', value: 18},
  ]; // Dados chart Backlog - Geral

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
  ]; // Categoria chart Backlog por módulo

  serBackLogMod = [
    {stack: 'Atendimento', data: [0, 0, 2, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1]},
    {stack: 'Desenvolvimento', data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]},
    {stack: 'Melhoria', data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    {stack: 'Resolvido - validação cliente', data: [4, 2, 1, 1, 2, 2 , 1 , 1, 1, 1, 1, 0, 1, 0]}
  ]; // Serie chart Backlog por módulo

  CatBackLogCritSta = [ 'Aberto', 'Em Espera', 'Novo', 'Pendente Cliente']; // Categoria chart Criticidade X Status

  serBackLogCritSta = [
    {name: 'Baixa', data: [3, 0, 1, 1]},
    {name: 'Normal', data: [2, 1, 1, 5]},
    {name: 'Alta', data: [4, 1, 0, 1]},
    {name: 'Urgente', data: [2, 2, 0, 2]},
  ]; // Serie chart Criticidade X Status

  dataPiePesquisa = [
    {category: 'Bad', value: 1},
    {category: 'Good', value: 21},
  ]; // Dados chart Pesquisa de Satisfação

  totalPesq = '22 Pesquisas eviadas'; // Total Pesquisa de Satisfação

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
  ]; // Itens Grid Pesquisa de Satisfação - Extrato Mês

  columnsPesq = [
    { property: 'ticket_id', label: 'Ticket Id', type: 'string', width: 8},
    { property: 'atribuido', label: 'Atribuído', type: 'string', width: 27},
    { property: 'good', label: 'Ticket Satisfaction' , type: 'string', width: 6}
  ]; // Colunas Grid Pesquisa de Satisfação - Extrato Mês

  constructor(private restZenService: RestZenService,
    private restJiraService: RestJiraService,
    private restTrelloService: RestTrelloService,
    private thfAlert: PoDialogService,
    private intl: IntlService) {
      this.labelBackLgGer = this.labelBackLgGer.bind(this);
    }

  ngOnInit() {

    this.restZenService.getToken();

    // Efetua autenticação no Empodera e armazena token de validação para demais requisições
    this.restZenService.authRequest('julio.silva@totvs.com.br', 'wtlk7nwdqs').subscribe(res => {
      if (res.status === 'ok') {
        this.restZenService.empoderaToken = res.token;

        /** Atualiza lista de cliente **/
        this.getClientes(res.token);
      }
    }, error => {
      console.log('erro requisição do token');
    });
  }

  /**
   * Inicia o processo de preenchimento dos graficos
   */
  incProc() {

    // Valida o preenchimento da data
    if ((this.startDate == undefined || this.startDate.toString() == '')) {
      this.thfAlert.alert({ title: 'Campos obrigatorios!', message: 'Preencha o campo Mês/Ano de referência' });
      return;
    }

    // Valida o preenchimento do cliente
    if (this.idCliente == '') {
      this.thfAlert.alert({ title: 'Campos obrigatorios!', message: 'Informe o cliente.' });
      return;
    }

    this.startMonth = this.startDate.toString().substring(0, 2);
    this.startYear = this.startDate.toString().substring(2);
    this.loadButton = true;

    // Busca os tickets do cliente selecionado na API do Empodera
    this.restZenService.getTickets(this.idCliente).subscribe( res => {
      console.log(res);
      this.AtualizaGraficos(res);
    });
  }

  /**
   * Busca lista de cliente através da API do Empodera
   *
   * @param empoderaToken Token Empodera para utilização na requisição
   */
  getClientes(empoderaToken) {

    this.restZenService.buscaClientes(empoderaToken).subscribe(response => {
      for (let _i = 0; response.length > _i; _i++) {
        this.clientesEmpodera.push({ label: response[_i].name, value: response[_i].codT });
      }
    }, error => { });
  }

  /**
   * Função executada ao selecionar cliente no combo comboCliente, para armazenar cliente selecionado
   *
   * @param idCliente Código do cliente digitado
   */
  setCliente(idCliente) {
    this.idCliente = idCliente;
  }

  /**
   * Efetua atualização dos graficos com os dados recebidos
   *
   * @param tickets Lista de tickets do cliente
   */
  AtualizaGraficos(tickets) {

    // tslint:disable-next-line:prefer-const
    let dataInicio = new Date(this.startMonth + '-01-' + this.startYear);
    let data;
    let posDataCateg = 0;

    for (let i = 0; tickets.length > i; i++) {
      data = new Date(tickets[i].created_at);
      if ((data.getMonth() == Number(this.startMonth) - 1 && data.getFullYear() == Number(this.startYear)) ||
        (data >= this.subMes(dataInicio, 5) && data < dataInicio)) {
        if (tickets[i].status == 'closed') {
          this.totTicketMesFe[data.getMonth()] += 1;
        } else {
          this.totTicketMesAb[data.getMonth()] += 1;
        }
      }

      if (data.getMonth() == Number(this.startMonth) - 1 && data.getFullYear() == Number(this.startYear)) {
        data = this.restJiraService.formatDate(tickets[i].created_at);
        posDataCateg = this.categVolTicAbMes.indexOf(data);
        if (posDataCateg >= 0) {
          this.serVolTicAbMes[0].data[posDataCateg] += 1;
        } else {
          this.categVolTicAbMes.push(data);
          this.serVolTicAbMes[0].data.push(1);
        }

        posDataCateg = this.catTicAbSouMesC.indexOf(this.labelTicAbSouMesC(tickets[i].priority));
        if (posDataCateg >= 0) {
          if (tickets[i].status == 'closed') {
            this.serTicAbSouMesC[1].data[posDataCateg] += 1;
          } else {
            this.serTicAbSouMesC[0].data[posDataCateg] += 1;
          }
        } else {
          if (tickets[i].status == 'closed') {
            this.serTicAbSouMesC[1].data.push(1);
            this.serTicAbSouMesC[0].data.push(0);
          } else {
            this.serTicAbSouMesC[0].data.push(1);
            this.serTicAbSouMesC[1].data.push(0);
          }
          this.catTicAbSouMesC.push(this.labelTicAbSouMesC(tickets[i].priority));
        }
      }
    }

    let y = 5;
    for (let x = 0; x < this.serVolTicSem[0].data.length; x++) {
      this.serVolTicSem[0].data[x] = this.totTicketMesAb[this.subMes(dataInicio, y).getMonth()];
      this.serVolTicSem[1].data[x] = this.totTicketMesFe[this.subMes(dataInicio, y).getMonth()];
      this.categVolTicSem.push(this.meses[this.subMes(dataInicio, y).getMonth()]);
      y -= 1;
    }
    this.mostraGraficos = true;

  }

  /**
   * Função executada na criação do chart Backlog Geral, para formatação da label
   *
   * @param args Argumentos de composição do chart
   */
  public labelBackLgGer(args: LegendLabelsContentArgs): string {
    return `${args.dataItem.value} (${this.intl.formatNumber(args.percentage, 'p1')})`;
  }

    /**
   * Função executada na criação do chart Backlog por Módulo, para formatação da label
   *
   * @param args Argumentos de composição do chart
   */
  public labelBkackLgMod(args: LegendLabelsContentArgs): boolean {
    return (args.value > 0 ? true : false);
  }

  /**
   * Função para ajuste da categoria do chart Tickets Abertos e Solucionados no Mês - Criticidade
   *
   * @param args String a ser ajustada
   */
  labelTicAbSouMesC(categoria): string {

    if (categoria == 'high') {
      return 'Alta';
    } else if (categoria == 'urgent') {
      return 'Urgente';
    } else if (categoria == 'low') {
      return 'Baixa';
    } else if (categoria == 'normal') {
      return 'Normal';
    }
    return categoria;
  }

  /**
   * Subtrai meses de uma data
   * @param data Data base
   * @param mes Quantidade de meses a subtrair
   */
  subMes(data, meses): Date {
    let mesAtu = data.getMonth();
    let anoAtu = data.getFullYear();
    const inicioSemestre = new Date(data);

    for (let i = 0; meses > i; i++) {
      if (mesAtu == 1) {
        mesAtu = 12;
        anoAtu -= 1;
      } else {
        mesAtu -= 1;
      }
    }

    inicioSemestre.setFullYear(anoAtu);
    inicioSemestre.setMonth(mesAtu);

    return inicioSemestre;
  }
}
