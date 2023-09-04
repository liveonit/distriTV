import { z } from 'zod';

export const updateMonitorBody = z.object({
  id: z.number().optional(),
  television: z.object({
    id: z.number()
  }),
  allProcessesAreRunning: z.boolean().optional(),
  appIsVisible: z.boolean().optional(),
  availableMem: z.number().optional(),
  availableStorage: z.number().optional(),
  availableStorageUnit: z.string().optional(),
  currentDate: z.string().transform((a) => new Date(a)),
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
  useExternalStorage: z.boolean().optional()
 
});

export type UpdateMonitorBodyType = z.infer<typeof updateMonitorBody>;
