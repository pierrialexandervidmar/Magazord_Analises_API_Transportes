import { useState } from 'react';
import './styles/global.css';

import { useForm, useFieldArray } from 'react-hook-form';
import { date, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


// ESQUEMA DO FORMULARIO COM SUAS VALIDAÇÕES DE ENTRADA EMBUTIDAS
const createUserFormSchema = z.object({
  identificador: z.string()
    .nonempty('O identificador é obrigatório')
    .transform(identificador => {
      // Remover espaços extras e transformar em maiúsculas
      return identificador.trim().toLowerCase().replace(/\s+/g, '');
    }),
  dataInicio: z.coerce.date().min(new Date(0), 'Data não pode ser vazia'),
  dataFim: z.coerce.date().min(new Date(0), 'Data não pode ser vazia'), // Adicionando o campo dataFim
  tabs: z.array(z.object({
    sigla: z.string()
      .nonempty('A sigla é obrigatória')
      .toUpperCase()
      .trim()
      .transform(sigla => {
        return sigla.replace(/\s+/g, '');
      }),
    idPrazo: z.coerce.number(),
    idPreco: z.coerce.number(),
  })).min(1, 'Insira pelo menos uma sigla e/ou tabela')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>

// ESTRUTURA GERAL DO COMPONENTE APP ===================================================================
export function App() {
  const [output, setOutput] = useState('')


  // UTILIZAÇÃO DO USE-FORM COM SEU TIPO E SCHEMA E VALIDAÇÕES
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })

  // UTILIZAÇÃO DO FIELDARRAY
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tabs',
  })

  // FUNÇÃO PARA ADICIONAR NOVA TABELA - TECH
  function addNewTech() {
    append({
      sigla: '',
      idPrazo: 0,
      idPreco: 0
    })
  }

  // ENVIAR DADOS PARA A API
  function createUser(data: any) {
    
    const adjustedDate = {
      ...data,
      dataInicio: data.dataInicio.toISOString().substring(0, 10),
      dataFim: data.dataFim.toISOString().substring(0, 10)
    };

    console.log(adjustedDate); // Verificar se as datas estão ajustadas corretamente

    setOutput(JSON.stringify(adjustedDate, null, 2));
  }


  // ESTRUTURA RETORNADA AO FRONTEND =========================================================================
  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-start">
      <h1 className="text-emerald-500 text-2xl font-semibold m-5">Análise de cotações</h1>
      <form
        onSubmit={handleSubmit(createUser)}
        className='flex flex-col gap-2 w-full max-w-screen-xl'
      >

        {/* FORMULARIO - IDENTIFICADORES */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Identificadores (separados por vírgula)</label>
          <textarea
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 p-1 bg-zinc-800 text-white'
            {...register('identificador')}
          />
          {errors.identificador && <span className='text-red-500 text-sm'>{errors.identificador.message}</span>}
        </div>

        {/* FORMULARIO - PERÍODO */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="" className="flex items-center justify-start">
            Período (até 30 dias)
          </label>
          <div className='flex items-center justify-start gap-1'>
            <div className='flex gap-1'>
              <input
                type="date"
                className='border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
                {...register('dataInicio')}
              />
              {errors.dataInicio && <span className='text-red-500 text-sm'>{errors.dataInicio.message}</span>}
            </div>
            <span>até</span>
            <div className='flex gap-1'>
              <input
                type="date"
                className='border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
                {...register('dataFim')}
              />
              {errors.dataFim && <span className='text-red-500 text-sm'>{errors.dataFim.message}</span>}
            </div>
          </div>

        </div>

        {/* FORMULÁRIO - TABELAS PARA COTAÇÃO */}
        <div className='flex flex-col gap-1'>
          <label htmlFor="" className="flex items-center justify-between">
            Sigla & Prazo & Preço

            <button
              type='button'
              onClick={addNewTech}
              className="text-emerald-500 text-sm"
            >
              Adicionar
            </button>
          </label>

          {/* RETORNA LISTA DE TABELAS PARA PREENCHER */}
          <div className='flex flex-wrap gap-5'>
          {fields.map((field, index) => {
            return (
              <div className='flex gap-2' key={field.id}>

                <div className='flex flex-2 flex-col gap-1'>
                  <input
                    type="text"
                    className='w-16 first-letter:border text- border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
                    {...register(`tabs.${index}.sigla`)}
                  />
                  {errors.tabs?.[index]?.sigla && <span className='text-red-500 text-sm'>{errors.tabs?.[index]?.sigla.message}</span>}
                </div>

                <div className='flex flex-col gap-1'>
                  <input
                    type="text"
                    className='input-number-tab w-14 appearance-none border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
                    {...register(`tabs.${index}.idPrazo`)}
                  />
                  {/* {errors.tabs?.[index]?.idPrazo && <span className='text-red-500 text-sm'>{errors.tabs?.[index]?.idPrazo.message}</span>} */}
                </div>

                <div className='flex flex-col gap-1'>
                  <input
                    type="text"
                    className='input-number-tab w-14 appearance-none border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
                    {...register(`tabs.${index}.idPreco`)}
                  />
                 {/* {errors.tabs?.[index]?.idPreco && <span className='text-red-500 text-sm'>{errors.tabs?.[index]?.idPreco.message}</span>} */}
                </div>

              </div>
            )
          })}
          </div>

          {errors.tabs && <span className='text-red-500 text-sm'>{errors.tabs.message}</span>}
        </div>
        <button
          type='submit'
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        >
          Realizar Cotação
        </button>

      </form>

      <pre>
        {output}
      </pre>

    </main>
  )
}