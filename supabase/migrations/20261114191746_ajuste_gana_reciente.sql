-- Fase 5 · T3 · En los ajustes gana el cambio más reciente (PRO-02).
--
-- La app sube los ajustes con upsert. Si un dispositivo sin red sube tarde un cambio
-- antiguo, no debe pisar uno más reciente de otro dispositivo: el disparador descarta
-- la actualización cuando su fecha es anterior a la guardada.

create function public.ajuste_conserva_reciente()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.actualizado < old.actualizado then
    return null; -- se ignora esta actualización; la fila queda como estaba
  end if;
  return new;
end;
$$;

revoke all on function public.ajuste_conserva_reciente() from public, anon, authenticated;

create trigger ajuste_conserva_reciente
before update on public.ajuste
for each row execute function public.ajuste_conserva_reciente();
