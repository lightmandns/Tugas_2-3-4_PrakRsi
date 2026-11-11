import type { Request, Response } from 'express';

export const getIdParam = (req: Request): number => Number(req.params.id);

export async function respond(
  res: Response,
  action: () => Promise<unknown>,
  successStatus = 200,
): Promise<Response> {
  try {
    const data = await action();
    return res.status(successStatus).json({ status: 'success', data });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_INPUT') {
      return res.status(400).json({ status: 'fail', message: 'Input tidak valid' });
    }
    if (error instanceof Error && error.message === 'RESOURCE_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
