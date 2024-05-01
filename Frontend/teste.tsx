<div className='flex flex-col gap-1'>
  <label htmlFor="" className="flex items-center justify-between">
    Período
  </label>
  <div className='flex gap-1'>
    <input
      type="date"
      className='border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
      {...register('dataInicio')}
    />
    {errors.dataInicio && <span>{errors.dataInicio.message}</span>}
  </div>

  <div className='flex gap-1'>
    <input
      type="date"
      className='border border-zinc-600 shadow-sm rounded h-8 px-1 bg-zinc-800 text-white'
      {...register('dataFim')}
    />
    {errors.dataInicio && <span>{errors.dataFim.message}</span>}
  </div>
</div>
