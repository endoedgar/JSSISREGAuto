function exibirEtapa() {

}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getAge(fromdate, todate){
    if(todate) todate= new Date(todate);
    else todate= new Date();

    var age= [],
    y= [todate.getFullYear(), fromdate.getFullYear()],
    ydiff= y[0]-y[1],
    m= [todate.getMonth(), fromdate.getMonth()],
    mdiff= m[0]-m[1],
    d= [todate.getDate(), fromdate.getDate()],
    ddiff= d[0]-d[1];

    if(mdiff < 0 || (mdiff=== 0 && ddiff<0))--ydiff;
    if(mdiff<0) mdiff+= 12;
    if(ddiff<0){
        fromdate.setMonth(m[1]+1, 0);
        ddiff= fromdate.getDate()-d[1]+d[0];
        --mdiff;
    }
    if(ydiff> 0) age.push(ydiff+ ' ano'+(ydiff> 1? 's ':' '));
    if(mdiff> 0) age.push(mdiff+ ' mes'+(mdiff> 1? 'es':''));
    if(ddiff> 0) age.push(ddiff+ ' dia'+(ddiff> 1? 's':''));
    if(age.length>1) age.splice(age.length-1,0,' e ');    
    return age.join('');
}

function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function estaOk(condicao)
{
	var classe = condicao ? 'auto_ok' : 'auto_erro'
	return '<div class="'+classe+'">'+(condicao?'OK':'FALHA')+'</div>';    
}

function adicionaLinha(info, condicao) {
	$('article#dev table tbody').append('<tr><td>'+info+'</td><td>'+estaOk(condicao)+'</td></tr>');
}

function checarProblemas(condicoes) {
	var ret = [];
	$.each(condicoes, function() {
		if(!this.condicao)
		ret.push(this.erro);
		adicionaLinha(this.descricao, this.condicao, this.erro);
	});
	return ret;
}

function diaUtil(dataAtual, contagem) {
	var dat = new Date(dataAtual);
	for(var i = 0; i < contagem;) {
		dat.setDate(dat.getDate() + 1);
		if(dat.getDay() != 0 && dat.getDay() != 6) // não é sábado e nem domingo
			++i;
	}
	return dat;
}


$(function(){
	if(document.URL.indexOf('http://sisregiiisp.saude.gov.br/cgi-bin/marcar')==0) {
		var currentTime = new Date();
		var daquiTantosDias = diaUtil(currentTime, 5);

		$(".datepicker").datepicker( "option", "minDate", daquiTantosDias );

		$('input[name="dt_desejada"]').change(function(){
			var strSelecionada = $(this).val();
			var selecionada = new Date(strSelecionada);
			if(strSelecionada.length > 0) {
				if(selecionada < daquiTantosDias) {
					$(this).val("");
					alert("Verificar quadro de avisos em tela inicial.");
				}
			}
		});
	} else if(document.URL.indexOf('http://sisregiiisp.saude.gov.br/cgi-bin/autorizador')==0 && $('textarea[name=justifDevolvido]').length) {
		var cidade = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)').text();
		var cid10 = $('input[name=cid_10]').val();
		var solicitante = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(18) > td:nth-child(2)').text();
		var solicitanteCPF = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(18) > td:nth-child(1)').text();
		var cns = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)').text();
		var data_nasc_str = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(1)').text();
		var data_desejada = $('table.table_listagem:nth-child(7) > tbody:nth-child(1) > tr:nth-child(23) > td:nth-child(2)').text();
    var data_nasc = new Date(data_nasc_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'));
		var idade = _calculateAge(data_nasc);
		var procedimento = $('input[name=pa]').val();
		var devEdit = $('textarea[name=justifDevolvido]');
		var erros;
		var condicoes = [
			{
				descricao: "É de ITAPEVA?", 
				condicao: cidade == 'ITAPEVA',
				erro: 'Verificar município informado ('+cidade+')',
        destino: 'negado'
			},
			{
				descricao: "CID não é R68-R69?", 
				condicao: cid10 != 'R68' && cid10 != 'R69',
				erro: 'CONFORME CAPACITAÇÃO DE 18/10/2013 O CID DEVE SER COMPATÍVEL COM O PROCEDIMENTO SOLICITADO.',
        destino: 'devolvido'
			},
			{
				descricao: "Data Desejada - Laboratório", 
				condicao: (procedimento != "1100000" && procedimento != "1101000") || (data_desejada.length > 0),
				erro: 'Informar data desejada.',
        destino: 'devolvido'
			},
			{
				descricao: "Solicitante cadastrado?",
				condicao: solicitanteCPF.length > 0,
				erro: "Solicitante não cadastrado, por gentileza justificar.",
        destino: 'devolvido'
			}
		];
		var botoes = [
			{
				secao: "devolvido",
				botao: "CID incompatível com a justificativa",
				condicao: true,
				msg: "CID ("+cid10+") incompatível com a justificativa."
			},
			{
				secao: "devolvido",
				botao: "Nome incompleto do solicitante",
				condicao: true,
				msg: "Informar nome completo do solicitante. (Informado: " + solicitante + ")"
			},
			{
				secao: "devolvido",
				botao: "Classificação de risco não justifica",
				condicao: true,
				msg: "Justificar a classificação de risco informada."
			},
			{
				secao: "devolvido",
				botao: "Falta justificativa",
				condicao: true,
				msg: "Conforme capacitação em 26/03/2014, todo o procedimento enviado para a regulação deve conter justificativa com o motivo da solicitação."
			},
			{
				secao: "devolvido",
				botao: "Procedimento não regulado",
				condicao: procedimento == "1100000",
				msg: "O procedimento solicitado deve ser agendado diretamente pela Unidade Solicitante, tendo em vista que se trata de não regulado."
			},
			{
				secao: "devolvido",
				botao: "Justificar se é rotina",
				condicao: procedimento == "6400031",
				msg: "Especificar se é rotina (primeira ou segunda)."
			},
			{
				secao: "devolvido",
				botao: "Semanas de gestação",
				condicao: procedimento == "6400031",
				msg: "Especificar a idade gestacional."
			},
			{
				secao: "devolvido",
				botao: "Transcrição?",
				condicao: procedimento != "6400031",
				msg: "Justificar se é transcrição."
			},
			{
				secao: "devolvido",
				botao: "OLHAR BRASIL - Falta Número de Convocação",
				condicao: procedimento == "0701501",
				msg: "Informar número da convocação feita pelo Departamento de Educação em Saúde conforme Ofício Circular Central de Regulação Ambulatorial de Itapeva - SMSI nº 017/2014."
			},
			{
				secao: "pendente",
				botao: "Solicito AM",
				condicao: true,
				msg: "Solicito AM"
			},
			{
				secao: "pendente",
				botao: "Solicito AM CID",
				condicao: true,
				msg: "Solicito AM CID "+ cid10 +" incompatível"
			}
      
		];
		$('.erroBt').remove();
		$('#dev').remove();

		$('#centdevolvido').remove();
		$('#centnegado').remove();
		$('#centpendente').remove();

		$('table.table_listagem:nth-child(1)').before('<article id="dev"><header>AUTO-Regulação</header><div><table><thead><tr><th>Item</th><th>Situação</th></tr></thead><tbody><tr><td>Idade:</td><td class="auto_ok">'+ getAge(data_nasc) +'</td></tr></tbody></table></div></article><div id="dialog"><iframe id="myIframe" src=""></iframe></div><button id="dialogBtn">Histórico</button>');
		
		$('div#devolvido').append('<center id="centdevolvido"></center>');
		$('div#negado').append('<center id="centnegado"></center>');
		$('div#pendente').append('<center id="centpendente"></center>');
		
		$.each(botoes, function() {
			if(this.condicao) {
				var secao = 'devolvido';
				if(this.secao != 'undefined')
					secao = this.secao;
				$('#cent'+secao).append('<input type="button"  class="erroBt" msg="'+this.msg+'" value="'+this.botao+'" secao="'+secao+'"/>');
			}
		});

		$('input.erroBt').click(function() {
			var onde = $('textarea[name=justif'+ capitaliseFirstLetter($(this).attr('secao')) +']');
			onde.val(onde.val() + '- ' + $(this).attr('msg')+'\n');
		});
		if(procedimento == "0703531") { // AVISO SOBRE O USO DE VAGAS DE GERIATRIA DE RETORNO COMO PRIMEIRA VEZ
			$('input[name=status]').click(function() {
				$('.avisoGeriatria').remove();
				if($('input[name=status]:checked').val() == 'A') {
					$('<tr class="avisoGeriatria"><td colspan=3><div class="auto_erro">Por gentileza, não agendar primeira consulta em vagas de retorno.</div></td></tr>').hide().insertAfter($('input[name=status]').parent().parent()).fadeIn();
				}
			});
		}
		erros = checarProblemas(condicoes);
		if(erros.length > 0) {
			$('article#dev').append('<input type="button" id="addErros" value="Adicionar estes erros na justif. de Devolução" />');
      var vdestino = 'devolvido';
      $.each(erros, function() {
        if(this.destino != "devolvido")
          vdestino = this.destino;
      });
      
      vdestino = $('textarea[name=justif'+ capitaliseFirstLetter(vdestino) +']');
      
			$('input#addErros').click(function() {
				if(vdestino.val().length <= 0) {
					vdestino.val(vdestino.val() +'Favor verificar os seguintes itens:\n');
				}
				var i = 0;
				$.each(erros, function() {
					vdestino.val(vdestino.val() + '- ' + this+'\n');
				});
			});
		} // fim

		$("#dialog").dialog({
			autoOpen: false,
			modal: true,
			width: 850,
			height: 600,
			open: function(ev, ui){
				$('#myIframe').attr('src', 'http://sisregiiisp.saude.gov.br/cgi-bin/cons_verificar?ETAPA=LISTAR&pg=0&total=&ordem=3&programa=CONS_VERIFICAR&codigo_solicicitacao=&co_solic=&cns='+cns+'&dt_inicial=&dt_final=&justificativa=');
				var ifr=document.getElementById('myIframe');
				ifr.onload=function(){
					$('h1', $( "#myIframe" ).contents()).remove();
					$('.table_listagem', $( "#myIframe" ).contents()).remove();
					$('center > table:nth-child(4)', $( "#myIframe" ).contents()).remove();
   				};
				
			}
		});

		$('#dialogBtn').click(function(){
			$('#dialog').dialog('open');
		});
	}
});