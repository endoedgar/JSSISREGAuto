function exibirEtapa() {

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
		var devEdit = $('textarea[name=justifDevolvido]');
		var erros;
		var condicoes = [
			{   descricao: "� de ITAPEVA?", 
				condicao: cidade == 'ITAPEVA',
				erro: 'Verificar munic�pio informado ('+cidade+')'
			},
			{ descricao: "CID n�o � R68-R69?", 
			  condicao: cid10 != 'R68' && cid10 != 'R69',
			  erro: 'CONFORME CAPACITA��O DE 18/10/2013 O CID DEVE SER COMPAT�VEL COM O PROCEDIMENTO SOLICITADO.'
			}
		];
		$('.erroBt').remove();
		$('#dev').remove();
		$('#centD').remove();
		$('table.table_listagem:nth-child(1)').before('<article id="dev"><header>AUTO-Regula��o</header><div><table><thead><tr><th>Item</th><th>Situa��o</th></tr></thead><tbody></tbody></table></div></article>');
		$('div#devolvido').append('<center id="centD"></center>');
		$('#centD').append('<input type="button"  class="erroBt" msg="CID ('+cid10+') incompat�vel com a justificativa." value="CID incompat�vel com a justificativa" />');
		$('#centD').append(' <input type="button" class="erroBt" msg="Informar nome completo do solicitante." value="Nome incompleto do solicitante" />');
		$('#centD').append(' <input type="button" class="erroBt" msg="Justificar a classifica��o de risco informada." value="Classifica��o de risco n�o justifica" />');
			 $('input.erroBt').click(function() {
				devEdit.val(devEdit.val() + '- ' + $(this).attr('msg')+'\n');
			});
		erros = checarProblemas(condicoes);
		if(erros.length > 0) {
		   $('article#dev').append('<input type="button" id="addErros" value="Adicionar estes erros na justif. de Devolu��o" />');
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