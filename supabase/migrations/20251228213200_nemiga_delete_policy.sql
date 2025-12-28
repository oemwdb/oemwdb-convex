-- Add DELETE policy for nemiga_source table

CREATE POLICY "Allow all deletes on nemiga_source" 
ON public.nemiga_source FOR DELETE
USING (true);
