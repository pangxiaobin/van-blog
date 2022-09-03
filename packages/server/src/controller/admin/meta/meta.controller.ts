import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { version } from '../../../utils/loadConfig';
import { AdminGuard } from 'src/provider/auth/auth.guard';
import { Request } from 'express';
import { MetaProvider } from 'src/provider/meta/meta.provider';
import { getVersionFromServer } from 'src/utils/getVersion';

@ApiTags('meta')
@UseGuards(...AdminGuard)
@Controller('/api/admin/meta')
export class MetaController {
  constructor(private readonly metaProvider: MetaProvider) {}
  @Get()
  async getAllMeta(@Req() req: Request) {
    const meta = await this.metaProvider.getAll();
    const serverData = await getVersionFromServer();
    const data = {
      version: version,
      latestVersion: serverData?.version || version,
      updatedAt: serverData?.updatedAt || new Date(),
      user: req.user,
      baseUrl: meta.siteInfo.baseUrl,
      enableComment: meta.siteInfo.enableComment || 'true',
    };
    return {
      statusCode: 200,
      data,
    };
  }
}
