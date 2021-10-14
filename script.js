function exibirEtapa() {

}

function formatDate(input) {
    var datePart = input.match(/\d+/g)
    day = datePart[0];
    month = datePart[1], year = datePart[2];

    return year + '/' + month + '/' + day;
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getAge(fromdate, todate) {
    if (todate) todate = new Date(todate);
    else todate = new Date();

    var age = [],
        y = [todate.getFullYear(), fromdate.getFullYear()],
        ydiff = y[0] - y[1],
        m = [todate.getMonth(), fromdate.getMonth()],
        mdiff = m[0] - m[1],
        d = [todate.getDate(), fromdate.getDate()],
        ddiff = d[0] - d[1];

    if (mdiff < 0 || (mdiff === 0 && ddiff < 0)) --ydiff;
    if (mdiff < 0) mdiff += 12;
    if (ddiff < 0) {
        fromdate.setMonth(m[1] + 1, 0);
        ddiff = fromdate.getDate() - d[1] + d[0];
        --mdiff;
    }
    if (ydiff > 0) age.push(ydiff + ' ano' + (ydiff > 1 ? 's ' : ' '));
    if (mdiff > 0) age.push(mdiff + ' mes' + (mdiff > 1 ? 'es' : ''));
    if (ddiff > 0) age.push(ddiff + ' dia' + (ddiff > 1 ? 's' : ''));
    if (age.length > 1) age.splice(age.length - 1, 0, ' e ');
    return age.join('');
}

function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function estaOk(condicao) {
    var classe = condicao ? 'auto_ok' : 'auto_erro'
    return '<div class="' + classe + '">' + (condicao ? 'OK' : 'FALHA') + '</div>';
}

function adicionaLinha(info, condicao, documento) {
    $('article#dev table tbody', documento).append('<tr><td>' + info + '</td><td>' + estaOk(condicao) + '</td></tr>');
}

function checarProblemas(condicoes, documento) {
    var ret = [];
    console.log(condicoes);

    $.each(condicoes, function() {
        if (!this.condicao)
            ret.push(this);
        adicionaLinha(this.descricao, this.condicao, documento);
    });
    return ret;
}

function diaUtil(dataAtual, contagem) {
    var dat = new Date(dataAtual);
    for (var i = 0; i < contagem;) {
        dat.setDate(dat.getDate() + 1);
        if (dat.getDay() != 0 && dat.getDay() != 6) // nÃ£o Ã© sÃ¡bado e nem domingo
            ++i;
    }
    return dat;
}


function datasUnidade(i) {
    var str = "";
    Dia_Atual = new Array(8)
    Dia_Atual[0] = "-"
    Dia_Atual[1] = "Domingo"
    Dia_Atual[2] = "Segunda-feira"
    Dia_Atual[3] = "TerÃ§a-feira"
    Dia_Atual[4] = "Quarta-feira"
    Dia_Atual[5] = "Quinta-feira"
    Dia_Atual[6] = "Sexta-feira"
    Dia_Atual[7] = "SÃ¡bado"
    if (i.length > 0) {
        str += "<ul>";
        i.forEach(function(e) {
            str += "<li>" + Dia_Atual[e.diaSemanal_id] + "</li>";
        })
        str += "</ul>";
    }
    return str;
}

function setaPaginaAntesRegulacao(documento) {
    var currentTime = new Date();
    var daquiTantosDias = diaUtil(currentTime, $('select[name="carater"]', documento).val() > 2 ? 5 : 0);

    $(".datepicker", documento).datepicker("option", "minDate", daquiTantosDias.toISOString().substring(0, 10));

    console.log(daquiTantosDias);

    $('input[name="dt_desejada"]', documento).unbind('change');
    $('input[name="dt_desejada"]', documento).change(function() {
        var strSelecionada = $(this).val();
        var selecionada = new Date(formatDate(strSelecionada));

        if (strSelecionada.length > 0) {
            if (selecionada < daquiTantosDias) {
                alert("Verificar quadro de avisos em tela inicial.");
                $(this).val('');
            }
        }
    });
}

function tratarPaginaMarcacao(documento) {
        var dados = {
		cnesSolicitante: $('#unid_solicitante > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)', documento).text()
	};
	
		$("<div class=\"niceWarn\">O CAMPO OBSERVAÃ‡ÃƒO DEVE SER PREENCHIDO OBRIGATORIAMENTE COM  O MOTIVO DA SOLICITAÃ‡ÃƒO DO PROCEDIMENTO.</div>", documento).insertBefore($("textarea[name=observacao]", documento));

        if (dados.cnesSolicitante != '6644813') {
            dados.cep = $('#endereco_paciente > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)', documento).text();
            //if(!cep.match(/184(.*)/)) {
            //	document.write('<h1>O CEP do Paciente <span style="color: red">'+cep+'</span> informado nÃ£o Ã© de Itapeva/SP! Favor corrigÃ­-lo no CartÃ£o SUS.</h1>');
            //}
        }

        dados.primeiroProcedimento = $('#classificacao_risco > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2) > font:nth-child(1) > i:nth-child(1)', documento).text();
        dados.primeiroProcedimentoNome = $('#classificacao_risco > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(1) > font:nth-child(1)', documento).text();
        dados.pacienteIdade = $('#dados_paciente > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(3)', documento).text().match(/\d+/);

	console.log(dados);

        var botaoFilaDeEspera = $('#form_solicitacao > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > input:nth-child(1)', documento);
        if (dados.primeiroProcedimentoNome.indexOf('CONSULTA') == 0 || dados.primeiroProcedimentoNome.indexOf('GRUPO - RADIODIAGNOSTICO - AGENDA LOCAL') || dados.primeiroProcedimentoNome.indexOf('ENDOSCOPIA') == 0) {
            botaoFilaDeEspera.attr("disabled", true);
            botaoFilaDeEspera.after("<marquee>ESTE PROCEDIMENTO NÃƒO VAI PARA </marquee>");
            console.log(botaoFilaDeEspera);
        }

        // USG Mama maior de 40 (data da Ãºltima mamografia)
        if (dados.primeiroProcedimento == '0205020097' && dados.pacienteIdade[0] > 40) {
            $('#main_div > form > center > input[type="button"]:nth-child(2)', documento).each(function() {
                // your button
                var btn = $(this);

                var clickhandler = this.onclick;
                this.onclick = null;


                btn.click(function() {
                    //alert('A');
                    //return false;
                });
                btn.click(clickhandler);
            });
            $('#form_solicitacao > table:nth-child(6) > tbody > tr:nth-child(2) > td > center', documento).before('Data da Ãºltima mamografia: <input type="text" class="datepickerdyn" required="required" id="dUltimaMamografia" />');
        }

        $('select[name="carater"]', documento).change(function() {
            setaPaginaAntesRegulacao(documento);
        });
        setaPaginaAntesRegulacao(documento);

        /*$.ajax({
            url: 'http://179.189.19.114:8083/jssisregauto/laboratorioSemana.php?unidade=' + dados.cnesSolicitante,
            dataType: 'json',
            async: false,
            data: [],
            success: function(data) {}
        });*/
}

function tratarPaginaRegulador(documento) {
	var dados = {
		cidade: $('tbody.FichaCompleta:nth-child(3) > tr:nth-child(14) > td:nth-child(2)', documento).text(),
		cid10: $('tbody.FichaCompleta:nth-child(6) > tr:nth-child(6) > td:nth-child(2)', documento).text(),
		solicitanteCnes: $('tbody.FichaCompleta:nth-child(1) > tr:nth-child(3) > td:nth-child(2)', documento).text(),
		solicitante: $('tbody.FichaCompleta:nth-child(1) > tr:nth-child(3) > td:nth-child(1)', documento).text(),
		solicitanteCPF: $('tbody.FichaCompleta:nth-child(6) > tr:nth-child(4) > td:nth-child(1)', documento).text(),
		cns: $('tbody.FichaCompleta:nth-child(3) > tr:nth-child(2) > td:nth-child(1) > font:nth-child(1)', documento).text(),
		data_nasc_str: $('tbody.FichaCompleta:nth-child(3) > tr:nth-child(4) > td:nth-child(3)', documento).text(),
		data_desejada: $('tbody.FichaCompleta:nth-child(6) > tr:nth-child(8) > td:nth-child(2)', documento).text(),
		procedimento: $('table.table_listagem:nth-child(1) > tbody:nth-child(8) > tr:nth-child(2) > td:nth-child(3)', documento).text(),
		devEdit: $('textarea[name=justifDevolvido]', documento),
		classificacaoDeRisco: $('tbody.FichaCompleta:nth-child(6) > tr:nth-child(6) > td:nth-child(3)', documento).text()
	};

	dados.data_nasc_str = dados.data_nasc_str.substring(0,dados.data_nasc_str.indexOf(' '));
	dados.data_desejada_semana = new Date(dados.data_desejada.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')).getDay() + 2;
	dados.data_nasc = new Date(dados.data_nasc_str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
	dados.idade = _calculateAge(dados.data_nasc);

        var erros;

        var unidadesSemana = []; //; [{"unidade_cnes":"2027151","diaSemanal_id":"2"},{"unidade_cnes":"2047446","diaSemanal_id":"2"},{"unidade_cnes":"2048493","diaSemanal_id":"2"},{"unidade_cnes":"2048876","diaSemanal_id":"2"},{"unidade_cnes":"2053152","diaSemanal_id":"2"},{"unidade_cnes":"2056259","diaSemanal_id":"2"},{"unidade_cnes":"2058219","diaSemanal_id":"2"},{"unidade_cnes":"2065436","diaSemanal_id":"2"},{"unidade_cnes":"6197353","diaSemanal_id":"2"},{"unidade_cnes":"6971199","diaSemanal_id":"2"},{"unidade_cnes":"7323859","diaSemanal_id":"2"},{"unidade_cnes":"2027151","diaSemanal_id":"3"},{"unidade_cnes":"2027208","diaSemanal_id":"3"},{"unidade_cnes":"2045443","diaSemanal_id":"3"},{"unidade_cnes":"2047446","diaSemanal_id":"3"},{"unidade_cnes":"2053152","diaSemanal_id":"3"},{"unidade_cnes":"2059134","diaSemanal_id":"3"},{"unidade_cnes":"2059142","diaSemanal_id":"3"},{"unidade_cnes":"6197353","diaSemanal_id":"3"},{"unidade_cnes":"6644813","diaSemanal_id":"3"},{"unidade_cnes":"7323859","diaSemanal_id":"3"},{"unidade_cnes":"2027151","diaSemanal_id":"4"},{"unidade_cnes":"2034301","diaSemanal_id":"4"},{"unidade_cnes":"2048833","diaSemanal_id":"4"},{"unidade_cnes":"2048884","diaSemanal_id":"4"},{"unidade_cnes":"2053152","diaSemanal_id":"4"},{"unidade_cnes":"2070979","diaSemanal_id":"4"},{"unidade_cnes":"6197353","diaSemanal_id":"4"},{"unidade_cnes":"6824625","diaSemanal_id":"4"},{"unidade_cnes":"6971199","diaSemanal_id":"4"},{"unidade_cnes":"6985890","diaSemanal_id":"4"},{"unidade_cnes":"2027151","diaSemanal_id":"5"},{"unidade_cnes":"2027216","diaSemanal_id":"5"},{"unidade_cnes":"2051273","diaSemanal_id":"5"},{"unidade_cnes":"2053071","diaSemanal_id":"5"},{"unidade_cnes":"2053152","diaSemanal_id":"5"},{"unidade_cnes":"2070995","diaSemanal_id":"5"},{"unidade_cnes":"2096390","diaSemanal_id":"5"},{"unidade_cnes":"6197353","diaSemanal_id":"5"},{"unidade_cnes":"2027143","diaSemanal_id":"6"},{"unidade_cnes":"2027151","diaSemanal_id":"6"},{"unidade_cnes":"2027178","diaSemanal_id":"6"},{"unidade_cnes":"2051559","diaSemanal_id":"6"},{"unidade_cnes":"2053152","diaSemanal_id":"6"},{"unidade_cnes":"6197353","diaSemanal_id":"6"},{"unidade_cnes":"6644813","diaSemanal_id":"6"}];
        /*$.ajax({
            url: 'http://179.189.19.114:8083/jssisregauto/laboratorioSemana.php',
            dataType: 'json',
            async: false,
            data: [],
            success: function(data) {
                unidadesSemana = data;
                console.log(data);
            }
        });*/
        var i = $.grep(unidadesSemana, function(e) {
            return e.unidade_cnes == dados.solicitanteCnes && e.diaSemanal_id == dados.data_desejada_semana;
        });
        var j = $.grep(unidadesSemana, function(e) {
            return e.unidade_cnes == dados.solicitanteCnes && dados.data_desejada.length > 0;
        });
        //console.log(i.length);
        var condicoes = [{
                descricao: "Ã‰ de ITAPEVA?",
                condicao: dados.cidade == 'ITAPEVA - SP',
                erro: 'MunicÃ­pio informado ' + dados.cidade,
                destino: "negado"
            }, {
                descricao: "CID nÃ£o Ã© R68-R69?",
                condicao: dados.cid10 != 'R68' && dados.cid10 != 'R69',
                erro: 'CONFORME PRECONIZADO, O CID DEVE SER COMPATÃVEL COM O PROCEDIMENTO SOLICITADO.',
                destino: "devolvido"
            }, {
                descricao: "Data Desejada Coleta - LaboratÃ³rio" + datasUnidade(j),
                condicao: (dados.procedimento != "1100000" && dados.procedimento != "1101000") || (dados.data_desejada.length > 0 && i.length > 0),
                erro: 'Informar data desejada.',
                destino: "devolvido"
            }, {
                descricao: "Solicitante cadastrado?",
                condicao: dados.solicitanteCPF != "NAO CADASTRADO",
                erro: "Solicitante nÃ£o cadastrado, por gentileza justificar.",
                destino: "devolvido"
            },

        ];
        var botoes = [{
                secao: "D",
                botao: "CID incompatÃ­vel com a justificativa",
                condicao: true,
                msg: "CID (" + dados.cid10 + ") incompatÃ­vel com a justificativa."
            }, {
                secao: "D",
                botao: "ClassificaÃ§Ã£o de risco nÃ£o justifica",
                condicao: true,
                msg: "Justificar a classificaÃ§Ã£o de risco informada. ("+dados.classificacaoDeRisco+")"
            }, {
                secao: "D",
                botao: "Falta justificativa",
                condicao: true,
                msg: "Conforme preconizado, todo o procedimento enviado para a regulaÃ§Ã£o deve conter justificativa com o motivo da solicitaÃ§Ã£o."
            }, {
                secao: "D",
                botao: "Procedimento nÃ£o regulado",
                condicao: dados.procedimento == "1100000",
                msg: "O procedimento solicitado deve ser agendado diretamente pela Unidade Solicitante, tendo em vista que se trata de nÃ£o regulado."
            }, {
                secao: "D",
                botao: "Justificar se Ã© rotina",
                condicao: dados.procedimento == "6400031",
                msg: "Especificar se Ã© rotina (primeira ou segunda)."
            }, {
                secao: "D",
                botao: "Semanas de gestaÃ§Ã£o",
                condicao: dados.procedimento == "6400031",
                msg: "Especificar a idade gestacional."
            }, {
                secao: "D",
                botao: "TranscriÃ§Ã£o?",
                condicao: dados.procedimento != "6400031",
                msg: "Justificar se Ã© transcriÃ§Ã£o."
            }, {
                secao: "D",
                botao: "OLHAR BRASIL - Falta NÃºmero de ConvocaÃ§Ã£o",
                condicao: dados.procedimento == "0701501",
                msg: "Informar nÃºmero da convocaÃ§Ã£o feita pelo Departamento de EducaÃ§Ã£o em SaÃºde conforme OfÃ­cio Circular Central de RegulaÃ§Ã£o Ambulatorial de Itapeva - SMSI nÂº 017/2014."
            }, {
                secao: "P",
                botao: "Solicito AM",
                condicao: true,
                msg: "Solicito AM"
            }, {
                secao: "P",
                botao: "Solicito AM CID",
                condicao: true,
                msg: "Solicito AM CID " + dados.cid10 + " incompatÃ­vel"
            }, {
                secao: "P",
                botao: "Autorizado - PorÃ©m sem vagas",
                condicao: true,
                msg: "Autorizado, porÃ©m sem vagas"
            }

        ];

        $('#btAM', documento).remove();

        $('<input type="button" id="btAM" value="AM"/>', documento).insertAfter('table.table_listagem:nth-child(33) > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(1) > input:nth-child(1)');

        $('.erroBt', documento).remove();
        $('#dev', documento).remove();

        $('#centdevolvido', documento).remove();
        $('#centnegado', documento).remove();
        $('#centpendente', documento).remove();

        $('table.table_listagem:nth-child(1)', documento).before('<LINK REL=StyleSheet HREF="https://endoedgar.github.io/JSSISREGAuto/estilo.css" TYPE="text/css" MEDIA=screen><article id="dev" style="display: none;"><header>AUTO-RegulaÃ§Ã£o</header><div><table><thead><tr><th>Item</th><th>SituaÃ§Ã£o</th></tr></thead><tbody><tr><td>Idade:</td><td class="auto_ok">' + getAge(dados.data_nasc) + '</td></tr></tbody></table></div><input type="button" id="dialogBtn" value="HistÃ³rico" /></article>');
	
	$('#dialogHistoricoReg').remove();
	$('body', document).append('<div id="dialogHistoricoReg"><iframe id="myIframe" src="" style="width: 850px; height: 600px;"></iframe></div>');   

	$('article#dev', documento).fadeIn(1200);
        $('div#devolvido', documento).append('<center id="centdevolvido"></center>');
        $('div#negado', documento).append('<center id="centnegado"></center>');
        $('div#pendente', documento).append('<center id="centpendente"></center>');

			$('input.erroBt', documento).live('click', function() {
				var onde = $('textarea[name=dsjustificativa]', documento);
				console.log('aaa');
				onde.val(onde.val() + '- ' + $(this).attr('msg') + '\n');
			});

	$('input[name=status]', documento).click(function() {
		$('.erroBt', documento).remove();
		$('#justifBotoes', documento).remove();
		$('#trcid', documento).before('<tr id="justifBotoes"><td align="center"></td></tr>');
		$.each(botoes, function() {
		    if (this.condicao && $('input[name=status]:checked', documento).val() == this.secao) {
		        $('#justifBotoes td', documento).append('<input type="button"  class="erroBt" msg="' + this.msg + '" value="' + this.botao + '" />');
		    }
		});
	});

        if (dados.procedimento == "0703531") { // AVISO SOBRE O USO DE VAGAS DE GERIATRIA DE RETORNO COMO PRIMEIRA VEZ
            $('input[name=status]', documento).click(function() {
                $('.avisoGeriatria', documento).remove();
                if ($('input[name=status]:checked', documento).val() == 'A') {
                    $('<tr class="avisoGeriatria"><td colspan=3><div class="auto_erro">Por gentileza, nÃ£o agendar primeira consulta em vagas de retorno.</div></td></tr>', documento).hide().insertAfter($('input[name=status]', documento).parent().parent()).fadeIn();
                }
            });
        }
        erros = checarProblemas(condicoes, documento);
        if (erros.length > 0) {
            $('article#dev', documento).append('<input type="button" id="addErros" value="Adicionar estes erros na justif. de DevoluÃ§Ã£o" />');

            $('input#addErros', documento).click(function() {
                var vdestino = "devolvido";
                var inicio = 'Favor verificar os seguintes itens:\n';
                $.each(erros, function() {
                    if (this.destino != "devolvido") {
                        vdestino = this.destino;
                        inicio = '';
                    }
                });

                vdestino = $('textarea[name=dsjustificativa]', documento);
                if (vdestino.val().length <= 0) {
                    vdestino.val(vdestino.val() + inicio);
                }
                var i = 0;
                $.each(erros, function() {
                    vdestino.val(vdestino.val() + '- ' + this.erro + '\n');
                });
            });
        } // fim

        $("#dialogHistoricoReg").dialog({
            autoOpen: false,
            modal: true,
            width: 850,
            height: 600,
		title: 'HistÃ³rico',
            open: function(ev, ui) {
		console.log('aaa');
                $('#myIframe').attr('src', 'http://sisregiii.saude.gov.br/cgi-bin/cons_verificar?ETAPA=LISTAR&pg=0&total=&ordem=&programa=CONS_VERIFICAR&codigo_solicicitacao=&co_solic=&cns=' + dados.cns + '&dt_inicial=&dt_final=');
                var ifr = document.getElementById('myIframe');
                ifr.onload = function() {
                    $('h1', $("#myIframe", documento).contents()).hide();
                    $('.table_listagem', $("#myIframe", documento).contents()).hide();
                    $('center > table:nth-child(4) > tr:nth-child(1)', $("#myIframe", documento).contents()).hide();
                };

            }
        });

        $('#dialogBtn', documento).click(function() {
		console.log('clicou');
            $('#dialogHistoricoReg').dialog('open');
        });

        $('#btAM', documento).click(function() {
            $('textarea[name=ds_justificativa_risco]', documento).val("AM");
            $("#id_sub_clas1", documento).attr('checked', true);
            Priorizar();
        });
}

function tratarPaginaMarcacaoInstrucoes(documento) {
	
	$("#avisoCid10", documento).remove();
	$("<div class=\"niceWarn\" id=\"avisoCid10\" style=\"position:absolute;\">CID INFORMADO DEVE SER COMPATÃVEL COM A JUSTIFICATIVA APRESENTADA. NÃƒO SERÃƒO ACEITOS CIDs GENÃ‰RICOS, SALVO EM CASOS ESPECÃFICOS JÃ ESTIPULADOS. Fonte: OfÃ­cio Circular Central de RegulaÃ§Ã£o Ambulatorial de Itapeva- SMSI nÂº 011/2014</div>", documento).insertAfter($('input[name=cid10]', documento));
					
	$('select[name=cpfprofsol]', documento).change(function() {	
		var prof = $(this).val();
		if(prof == '00000000000') {
			$("#avisoProf", documento).remove();
			$("<div class=\"niceWarn\" id=\"avisoProf\" style=\"margin-left:0; width: 150px;\">SOLICITANTE NÃƒO CADASTRADO NA UNIDADE DEVE-SE JUSTIFICAR EM CAMPO OBSERVAÃ‡ÃƒO.</div>", documento).insertAfter($('input[name=nomeprofsol]', documento));
		}
	});
	$('select[name=pa]', documento).change(function() {	
		var dados;
		var procedimento = $(this).val();
		$('#avisoProcedimentoItapeva', documento).fadeOut(400, function() { $(this).remove(); });
		$('input[name=cid10]', documento).parent().attr('valign', 'center');
		 $.ajax({
			    url: 'http://saude.itapeva.sp.gov.br:8083/JSSISREGAuto/procedimentoInstrucao.php?r='+Math.random()+'&procedimento='+procedimento,
			    dataType: 'json',
			    async: true,
			    data: [],
			    success: function(data) {
					dados = data;
					console.log(data);

					if (dados.instrucao != undefined) {
						$('<div id="avisoProcedimentoItapeva">'+dados.instrucao+'</div>', documento).hide().insertAfter($('select[name=pa]', documento)).fadeIn();
					}
			    }
			});
	});
}

function tratarPaginaSolicitacao(documento) {
	console.log('tratarPaginaSolicitacao');
	$(documento).ready(function() {
		$("<div class=\"niceWarn\">PARA QUE SE EFETIVE O AGENDAMENTO OS DADOS DO CARTÃƒO SUS (CNS) DO PACIENTE DEVEM ESTAR PREENCHIDOS <span class=\"destacar\">NA INTEGRALIDADE E ATUALIZADOS</span>. CASO NÃƒO ESTEJAM, SERÃ NEGADO AUTOMATICAMENTE.</div>", documento).insertBefore($('table[class=table_listagem]', documento));
	});
}

function tratarPaginaMarcacaoPrevia(documento) {
	console.log('tratarPaginaMarcacaoPrevia');
	$(documento).ready(function() {
		$("<div class=\"niceWarn\">SISREG AMBULATORIAL destina-se Ã  regulaÃ§Ã£o de procedimentos em carÃ¡terÂ <b>ELETIVO</b>. UrgÃªncias mÃ©dicas ou solicitaÃ§Ãµes emergenciais devem ser direcionadas aos serviÃ§os de urgÃªncia e emergÃªncia, nÃ£o se justificando agendamento de procedimentos em perÃ­odo inferior aÂ <b>CINCO DIAS ÃšTEIS</b>Â da solicitaÃ§Ã£o.</div>", documento).insertBefore($('input[name=btnSolicitar]', documento).parent());
	});
}

function tratarPagina(documento) {
    console.log(documento);
	$('head', $(documento)).append('<link rel="stylesheet" href="https://endoedgar.github.io/JSSISREGAuto/estilo.css" type="text/css" />');
    if (documento.URL.indexOf('http://sisregiii.saude.gov.br/cgi-bin/marcar') == 0 && $('textarea[name=observacao]', $(documento)).length) {
        tratarPaginaMarcacao(documento);
    } else if (documento.URL.indexOf('http://sisregiii.saude.gov.br/cgi-bin/marcar') == 0 && $('select[name=pa]', $(documento)).length) {
        tratarPaginaMarcacaoInstrucoes(documento);
	} else if (documento.URL.indexOf('http://sisregiii.saude.gov.br/cgi-bin/marcar') == 0 && $('input[name=btnSolicitar]', $(documento)).length) {
        tratarPaginaMarcacaoPrevia(documento);
    } else if (documento.URL.indexOf('http://sisregiii.saude.gov.br/cgi-bin/autorizador') == 0 && $('textarea[name=dsjustificativa]', $(documento)).length) {
		tratarPaginaRegulador(documento);
    } else if (documento.URL.indexOf('http://sisregiii.saude.gov.br/cgi-bin/cadweb50') == 0 && $('input[name=nu_cns]', $(documento)).length) {
		tratarPaginaSolicitacao(documento);
	}
}

$(function() {
    /* hotfix 001 - lab sÃ£o lucas */
    $(document).ready(function() {
        console.log(document);
        $('iframe#f_main').load(function(o) {
            tratarPagina(o.currentTarget.contentDocument);

		var content = o.currentTarget.contentDocument.body.innerHTML.toString();
		var hasText = content.indexOf("LABORATORIO SAO LUCAS ITAPEVA") !== -1 && content;
		if (hasText && content !== null) {
		    $('#area', o.currentTarget.contentDocument).show();
		}
        });
    });

});
