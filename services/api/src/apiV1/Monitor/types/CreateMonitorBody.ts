import { z } from 'zod';

export const createMonitorBody = z.object({
  television: z.object({
    id: z.number()
  }).optional(),
  allProcessesAreRunning: z.boolean().optional(),
  appIsVisible: z.boolean().optional(),
  availableMem: z.number().optional(),
  availableStorage: z.number().optional(),
  availableStorageUnit: z.string().optional(),
  currentDate: z.string().transform((a) => new Date(a)).optional(),
  currentVersionApp: z.string().optional(),
  currentlyPlayingContentId: z.number().optional(),
  externalStoragePermissionGranted: z.boolean().optional(),
  isAnyAlertPlaying: z.boolean().optional(),
  isAnyContentPlaying: z.boolean().optional(),
  isExternalStorageConnected: z.boolean().optional(),
  memUnit: z.string().optional(),
  sdkVersion: z.number().optional(),
  totalMem: z.number().optional(),
  totalStorage: z.number().optional(),
  totalStorageUnit: z.string().optional(),
  tvCode: z.string().optional(),
  useExternalStorage: z.boolean().optional(),
  anticipationDays: z.number().optional(),
});

export type CreateMonitorBodyType = z.infer<typeof createMonitorBody>;

