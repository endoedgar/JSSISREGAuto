function exibirEtapa() {

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

$(function(){
	$('input.printAutorizacao[name=imprime]').replaceWith('<input type=button value="Imprimir #" onClick="window.print();" >');
	if(document.URL=='http://sisregiiisp.saude.gov.br/cgi-bin/autorizador' && $('textarea[name=justifDevolvido]').length) {
		var cidade = $('table.table_listagem:nth-child(8) > tbody:nth-child(1) > tr:nth-child(10) > td:nth-child(2)').text();
		var cid10 = $('input[name=cid_10]').val();
		var data_nasc_str = $('table.table_listagem:nth-child(8) > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(1)').text();
		var data_nasc = new Date(data_nasc_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1'));
		var idade = _calculateAge(data_nasc);
		var procedimento = $('input[name=pa]').val();
		var devEdit = $('textarea[name=justifDevolvido]');
		var erros;
		var condicoes = [
			{
				descricao: "É de ITAPEVA?", 
				condicao: cidade == 'ITAPEVA',
				erro: 'Verificar município informado ('+cidade+')'
			},
			{
				descricao: "CID não é R68-R69?", 
				condicao: cid10 != 'R68' && cid10 != 'R69',
				erro: 'CONFORME CAPACITAÇÃO DE 18/10/2013 O CID DEVE SER COMPATÍVEL COM O PROCEDIMENTO SOLICITADO.'
			},
			{
				descricao: "Olhar Brasil", 
				condicao: procedimento != "2300024" || (procedimento == "2300024" && (idade < 3 || idade > 16)),
				erro: 'Esta solicitação deve ser feita indicando a opção consulta em Oftalmologia - Olhar Brasil pois o paciente está na faixa etária de 3 a 16 anos.'
			}
		];
		var botoes = [
			{
				botao: "CID incompatível com a justificativa",
				condicao: true,
				msg: "CID ("+cid10+") incompatível com a justificativa."
			},
			{
				botao: "Nome incompleto do solicitante",
				condicao: true,
				msg: "Informar nome completo do solicitante."
			},
			{
				botao: "Classificação de risco não justifica",
				condicao: true,
				msg: "Justificar a classificação de risco informada."
			},
			{
				botao: "Falta justificativa",
				condicao: true,
				msg: "Conforme capacitação em 26/03/2014, todo o procedimento enviado para a regulação deve conter justificativa com o motivo da solicitação."
			},
			{
				botao: "Procedimento não regulado",
				condicao: procedimento == "1100000",
				msg: "O procedimento solicitado deve ser agendado diretamente pela Unidade Solicitante, tendo em vista que se trata de não regulado."
			},
			{
				botao: "Justificar se é rotina",
				condicao: procedimento == "6400031",
				msg: "Especificar se é rotina (primeira ou segunda)."
			},
			{
				botao: "Semanas de gestação",
				condicao: procedimento == "6400031",
				msg: "Especificar a idade gestacional."
			},
			{
				botao: "Transcrição?",
				condicao: procedimento != "6400031",
				msg: "Justificar se é transcrição."
			},
			{
				botao: "Olhar Brasil",
				condicao: procedimento == "2300024",
				msg: "Esta solicitação deve ser feita indicando a opção consulta em Oftalmologia - Olhar Brasil pois o paciente está na faixa etária de 3 a 16 anos."
			}
		];
		$('.erroBt').remove();
		$('#dev').remove();
		$('#centD').remove();
		$('table.table_listagem:nth-child(1)').before('<article id="dev"><header>AUTO-Regulação</header><div><table><thead><tr><th>Item</th><th>Situação</th></tr></thead><tbody></tbody></table></div></article>');
		$('div#devolvido').append('<center id="centD"></center>');
		$.each(botoes, function() {
			if(this.condicao) {
				$('#centD').append('<input type="button"  class="erroBt" msg="'+this.msg+'" value="'+this.botao+'" />');
			}
		});
		$('input.erroBt').click(function() {
			devEdit.val(devEdit.val() + '- ' + $(this).attr('msg')+'\n');
		});
		erros = checarProblemas(condicoes);
		if(erros.length > 0) {
			$('article#dev').append('<input type="button" id="addErros" value="Adicionar estes erros na justif. de Devolução" />');
			$('input#addErros').click(function() {
				if(devEdit.val().length <= 0) {
					devEdit.val(devEdit.val() +'Favor verificar os seguintes itens:\n');
				}
				var i = 0;
				$.each(erros, function() {
					devEdit.val(devEdit.val() + '- ' + this+'\n');
				});
			});
		} // fim
	}
});