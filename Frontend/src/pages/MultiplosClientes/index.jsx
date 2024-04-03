import './styles.css'
import '../../App.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    calculaMediaMenoresValoresFrete,
    retornaMenorValor,
    retornaSegundoMenorValor,
    calculaDiferencaMenoresValoresFrete,
    retornaQuantidadeCotacoes,
    retornaQuantidadeTransportadorasCotadas,
    retornaMenorPrazo,
    retornaSegundoMenorPrazo,
    calculaDiferencaMenoresPrazos,
    retornaTransportadoraMaisCotada,
    calculaMediaValorTransportadoraMaisCotada,
    calculaMediaOpcoesFreteCliente
} from '../../Utils/Calculos'

import {
    retornaNomeTransportadoraMaisBarata,
    retornaNomeSegundaTransportadoraMaisBarata,
    retornaNomeTransportadoraMaisRapida,
    retornaNomeSegundaTransportadoraMaisRapida
} from '../../Utils/Filtros'
import { formatarMoeda } from '../../Utils/Formatacoes';
import axios from 'axios'


/**
 * Componente React para realizar cotações de frete em tempo real para múltiplos clientes/transportadoras.
 * 
 * @module Servico
 * @component
 * @author Pierri Alexander Vidmar
 * @since 2024-01-01
 */
function MultiplosClientes() {
    const baseURL = 'https://api-transporte.magazord.com.br/api/v1/calculoFrete';
    const [tokenInput, setTokenInput] = useState('');

    const [totalCotacoes, setTotalCotacoes] = useState();
    const [totalTransportadorasCotadas, setTotalTransportadorasCotadas] = useState();

    const [freteInfo, setFreteInfo] = useState({
        menorValor: undefined,
        segundoMenorValor: undefined,
        valorMediaMenorValor: undefined,
        valorDiferencaMenoresValores: undefined,
        quantidadeCotacoes: undefined,
        quantidadeTransportadorasCotadas: undefined,
        menorPrazo: undefined,
        segundoMenorPrazo: undefined,
        valorDiferencaMenoresPrazos: undefined,
        nomeTransportadoraMaisBarata: undefined,
        nomeSegundaTransportadoraMaisBarata: undefined,
        nomeTransportadoraMaisRapida: undefined,
        nomeSegundaTransportadoraMaisRapida: undefined,
        transportadoraMaisCotada: undefined,
        mediaValorTransportadoraMaisCotada: undefined,
        mediaOpcoesFreteCliente: undefined
    });
      
    const [servico, setServico] = useState({
        cepOrigem: '',
        cepDestino: '',
        altura: '',
        largura: '',
        peso: '',
        valor: ''
    })

    const servicoPayload = {
        "cliente": "",
        "cepOrigem": servico.cepOrigem,
        "cepDestino": servico.cepDestino,
        "dimensaoCalculo": "altura",
        "valorDeclarado": Number(servico.valor && servico.valor ? servico.valor.replace(',', '.') : 0),
        "produtos": [
            {
                "altura": Number(servico.altura && servico.altura.replace ? servico.altura.replace(',', '.') : 0),
                "largura": Number(servico.largura && servico.largura.replace ? servico.largura.replace(',', '.') : 0),
                "comprimento": Number(servico.comprimento && servico.comprimento.replace ? servico.comprimento.replace(',', '.') : 0),
                "peso": Number(servico.peso && servico.peso.replace ? servico.peso.replace(',', '.') : 0),
                "quantidade": 1,
                "valor": Number(servico.valor && servico.valor.replace ? servico.valor.replace(',', '.') : 0),
                "volumes": 1,
                "volumesDetalhes": [
                    {
                        "peso": Number(servico.peso && servico.peso.replace ? servico.peso.replace(',', '.') : 0),
                        "altura": Number(servico.altura && servico.altura.replace ? servico.altura.replace(',', '.') : 0),
                        "largura": Number(servico.largura && servico.largura.replace ? servico.largura.replace(',', '.') : 0),
                        "comprimento": Number(servico.comprimento && servico.comprimento.replace ? servico.comprimento.replace(',', '.') : 0)
                    }
                ]
            }
        ],
        "gateways": [
            {
                "identificador": "api",
                "servicos": [
                    "EXP",
                    "BAU",
                    "TNT",
                    "NTV",
                    "JAD-EC",
                    "JAD-EX"
                ]
            }, {
                "identificador": "melhorEnvio",
                "servicos": [
                    "ME2",
                    "ME1",
                    "ME4",
                    "ME5",
                    "ME17",
                    "ME31",
                    "ME12",
                    "ME27",
                    "ME3",
                    "ME15"
                ]
            },
            {
                "identificador": "flixlog",
                "servicos": [
                    "FLIX",
                    "FLIX193",
                    "FLIX256",
                    "FLIX18",
                    "FLIX182",
                    "FLIX10"
                ]
            },
            {
                "identificador": "kangu",
                "servicos": [
                    "KNG_120720464_E",
                    "KNG_9900_X",
                    "KNG_112347896_E",
                    "KNG_9900_E",
                    "KNG_9900_M",
                    "KNG_1761837_E",
                    "KNG_28719_E",
                    "KNG_12532_E",
                    "KNG_9964_E",
                    "KNG_112350203_E",
                    "KNG_420053_E",
                    "KNG_21_E"
                ]
            }
        ],
        "servicos": [
            "DAY",
            "JET",
            "S2C",
            "RDN",
            "VIP",
            "DML",
            "BPS",
            "BAU",
            "ACE",
            "ATC",
            "PMC",
            "SAT",
            "AST",
            "ARL",
            "AZC",
            "BAR",
            "BRS",
            "BRP",
            "BSP",
            "BSF",
            "BRE",
            "BUM",
            "BUR",
            "BSJ",
            "BUS-RS",
            "BSC",
            "BUP",
            "CAR",
            "CSP",
            "CPX",
            "DAM",
            "DBA",
            "DSP",
            "DES",
            "DIC",
            "DKT",
            "DLO",
            "DML",
            "FDX",
            "GFL",
            "GFP",
            "ITL",
            "JAD-EC",
            "JAD-EX",
            "JDL",
            "JMF",
            "LAT",
            "LGG",
            "NEX",
            "NSP",
            "NTL",
            "NRE",
            "ORN",
            "PLA",
            "PTX",
            "RRS",
            "RPR",
            "RES",
            "REU",
            "RSP",
            "ROD",
            "RLE",
            "RPE",
            "RDP",
            "RDC",
            "RDN",
            "STO",
            "TRO",
            "UEL",
            "ZNT"
        ]
    }

    const handleChange = (event) => {
        setServico({ ...servico, [event.target.name]: event.target.value })
    }

    const handleTokenChange = (event) => {
        setTokenInput(event.target.value);
    }

    const handleConsultar = async (event) => {
        event.preventDefault()

        if (!servico.cepOrigem || !servico.cepDestino || !servico.altura || !servico.largura || !servico.peso || !tokenInput || !servico.valor || !servico.comprimento) {
            toast.error("Atenção! TODOS os campos devem ser preenchidos!");
            return;
        }

        try {
            const tokensDoCliente = tokenInput.split(',');

            const requests = tokensDoCliente.map(async (token) => {
                const tokenizedPayload = { ...servicoPayload, cliente: token.trim() };
                const result = await axios.post(baseURL, tokenizedPayload);
                console.log(`Resultados para o token ${token}:`, result.data.servicos);
                return result.data.servicos;
            });

            const results = await Promise.all(requests);
            gerarCalculos(results)
            limparCampos();
            toast.success("Cotação efetuada com sucesso!");
        } catch (error) {
            console.error('Erro ao consultar:', error);
        }
    }

    const limparCampos = () => {
        setServico({
            cepOrigem: '',
            cepDestino: '',
            altura: '',
            largura: '',
            peso: ''
        });
        setTokenInput('');
    };

    const gerarCalculos = (resultados) => {
        setTotalCotacoes(retornaQuantidadeCotacoes(resultados));
        setTotalTransportadorasCotadas(retornaQuantidadeTransportadorasCotadas(resultados))
        setFreteInfo({
            menorValor: retornaMenorValor(resultados),
            segundoMenorValor: retornaSegundoMenorValor(resultados),
            valorMediaMenorValor: calculaMediaMenoresValoresFrete(resultados),
            valorDiferencaMenoresValores: calculaDiferencaMenoresValoresFrete(resultados),
            quantidadeCotacoes: retornaQuantidadeCotacoes(resultados),
            quantidadeTransportadorasCotadas: retornaQuantidadeTransportadorasCotadas(resultados),
            menorPrazo: retornaMenorPrazo(resultados),
            segundoMenorPrazo: retornaSegundoMenorPrazo(resultados),
            nomeTransportadoraMaisBarata: retornaNomeTransportadoraMaisBarata(resultados),
            nomeSegundaTransportadoraMaisBarata: retornaNomeSegundaTransportadoraMaisBarata(resultados),
            nomeTransportadoraMaisRapida: retornaNomeTransportadoraMaisRapida(resultados),            
            nomeSegundaTransportadoraMaisRapida: retornaNomeSegundaTransportadoraMaisRapida(resultados),
            valorDiferencaMenoresPrazos: calculaDiferencaMenoresPrazos(resultados),
            transportadoraMaisCotada: retornaTransportadoraMaisCotada(resultados),
            mediaValorTransportadoraMaisCotada: calculaMediaValorTransportadoraMaisCotada(resultados),
            mediaOpcoesFreteCliente: calculaMediaOpcoesFreteCliente(resultados),
        });
    }

    // ============================================================================================

    return (
        <div className="container p-0">
            <h1 className='titulo'>Cotações em múltiplos clientes</h1>
            <p>Obtenha a cotação em tempo real para múltiplos clientes/transportadoras</p>
            <br />

            <form onSubmit={handleConsultar} className='form-container'>
                <div className='col-12'>

                    <div class="row mb-3">
                        <label htmlFor="tokens" className='col-sm-2 col-form-label'>Tokens</label>
                        <div class="col-sm-10">
                            <textarea onChange={handleTokenChange} value={tokenInput || ''} name='tokens' type="text" className='form-control input-style' id='tokens' placeholder='Informe os tokens separados por vírgula, ex: CASA-EPGI-UTJF-PUQC, DECO-KMWG-XDRI-KNNB,' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="cepOrigem" className='col-sm-2 col-form-label'>Origem</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.cepOrigem || ''} name='cepOrigem' type="text" className='form-control input-style' id='cepOrigem' />
                        </div>

                        <label htmlFor="cepDestino" className='col-sm-1 col-form-label'>Destino</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.cepDestino || ''} name='cepDestino' type="text" className='form-control input-style' id='cepDestino' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="altura" className='col-sm-2 col-form-label'>Altura</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.altura || ''} name="altura" type="text" className='form-control input-style' id='altura' />
                        </div>

                        <label htmlFor="largura" className='col-sm-1 col-form-label'>Largura</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.largura || ''} name="largura" type="text" className='form-control input-style' id='largura' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="comprimento" className='col-sm-2 col-form-label'>Comprimento</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.comprimento || ''} name="comprimento" type="text" className='form-control input-style' id='comprimento' />
                        </div>

                        <label htmlFor="peso" className='col-sm-1 col-form-label'>Peso</label>
                        <div class="col-sm-5">
                            <input onChange={handleChange} value={servico.peso || ''} name="peso" type="text" className='form-control input-style' id='peso' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <label htmlFor="tokens" className='col-sm-2 col-form-label'>Valor</label>
                        <div class="col-sm-4">
                            <input onChange={handleChange} value={servico.valor || ''} name='valor' type="text" className='form-control input-style' id='valor' />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div className="col-sm-7 total-cotacoes">
                            Total de Cotações Executadas: {totalCotacoes || 0} - Número de Transportadoras Captadas: {totalTransportadorasCotadas || 0}
                        </div>
                        <div className="col-sm-5 botao-submit"> {/* Utilize ml-auto para a margem à esquerda automática */}
                            <input type="submit" className='btn btn-primary col-sm-8 btn-cotacao' value="Efetuar Cotação" /> {/* Utilize col-sm-12 para ocupar toda a largura da coluna */}
                        </div>
                    </div>
                </div>
            </form>

            {/* CARDS */}
            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                    <div className="card-header">Menor valor de frete</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {freteInfo.nomeTransportadoraMaisBarata}</h5>
                        <p className="card-text fw-bold">{freteInfo.menorValor !== undefined ? formatarMoeda(freteInfo.menorValor) : 'R$ 0,00'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Segundo menor valor de frete</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {freteInfo.nomeSegundaTransportadoraMaisBarata}</h5>
                        <p className="card-text fw-bold">{freteInfo.segundoMenorValor !== undefined ? formatarMoeda(freteInfo.segundoMenorValor) : 'R$ 0,00'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                    <div className="card-header"><strong>&lt;&gt;</strong> entre menor e segundo menor</div>
                    <div className="card-body">
                        <h5 className="card-title">Resultado:</h5>
                        <p className="card-text fw-bold">{freteInfo.valorDiferencaMenoresValores !== undefined ? formatarMoeda(freteInfo.valorDiferencaMenoresValores)  + " de diferença": 'R$ 0,00'}</p>
                    </div>
                </div>
            </div>

            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                    <div className="card-header">Menor prazo de entrega </div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {freteInfo.nomeTransportadoraMaisRapida}</h5>
                        <p className="card-text fw-bold">{freteInfo.menorPrazo !== undefined ? freteInfo.menorPrazo + " dia(s)" : '0'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Segundo menor prazo</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {freteInfo.nomeSegundaTransportadoraMaisRapida}</h5>
                        <p className="card-text fw-bold">{freteInfo.segundoMenorPrazo !== undefined ? freteInfo.segundoMenorPrazo + " dia(s)" : '0'}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                    <div className="card-header"><strong>&lt;&gt;</strong> menor e segundo menor prazo</div>
                    <div className="card-body">
                        <h5 className="card-title">Resultado:</h5>
                        <p className="card-text fw-bold">{freteInfo.valorDiferencaMenoresPrazos !== undefined ? freteInfo.valorDiferencaMenoresPrazos + " dia(s) de diferença" : '0'}</p>
                    </div>
                </div>
            </div>

            <div className="row mb-3 card-unique">
                <div className="card card-unit text-white bg-primary mb-4">
                <div className="card-header">Transportadora + captou</div>
                    <div className="card-body">
                        <h5 className="card-title">Transportadora: {freteInfo.transportadoraMaisCotada?.codigoMaisCotado || ''}</h5>
                        <h5 className="card-title">Quantidade: {freteInfo.transportadoraMaisCotada?.contagemMaisCotada && freteInfo.transportadoraMaisCotada?.contagemMaisCotada  + ' vezes' || ''}</h5>
                        <h5 className="card-title">Valor Média: {freteInfo.mediaValorTransportadoraMaisCotada !== undefined ? formatarMoeda(freteInfo.mediaValorTransportadoraMaisCotada) || '' : "R$ 0,00"}</h5>
                    </div>
                </div>
                <div className="card card-unit text-white bg-secondary mb-4 mr-3">
                    <div className="card-header">Media de opções</div>
                    <div className="card-body">
                        <h5 className="card-title">Média de opções de frete por cliente</h5>
                        <p className="card-text">Média: {freteInfo.mediaOpcoesFreteCliente !== undefined ? freteInfo.mediaOpcoesFreteCliente : "0"}</p>
                    </div>
                </div>
                <div className="card card-unit text-white bg-success mb-4">
                <div className="card-header">Título</div>
                    <div className="card-body">
                        <h5 className="card-title">Subtítulo</h5>
                        <p className="card-text">Conteúdo</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MultiplosClientes;