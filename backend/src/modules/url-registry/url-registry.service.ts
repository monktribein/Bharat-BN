import { Injectable, NotFoundException } from '@nestjs/common';

export interface UrlRegistryRecord {
  id: string;
  path: string;
  owner: 'wordpress' | 'next';
  migrationState: 'legacy_wp' | 'in_progress' | 'completed';
  statusCode: number;
  redirectTarget?: string;
  entityType?: string;
  entityId?: string;
}

@Injectable()
export class UrlRegistryService {
  // In-memory / DB fallback cache for ultra-fast edge lookups
  private registry: Map<string, UrlRegistryRecord> = new Map([
    [
      '/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
      {
        id: 'reg-001',
        path: '/mumbai/healthcare-clinics/apex-super-speciality-dental-clinic-andheri-mumbai',
        owner: 'next',
        migrationState: 'completed',
        statusCode: 200,
        entityType: 'business',
        entityId: '55555555-5555-5555-5555-555555555001',
      },
    ],
    [
      '/old-wp-sample-post/',
      {
        id: 'reg-wp-001',
        path: '/old-wp-sample-post/',
        owner: 'wordpress',
        migrationState: 'legacy_wp',
        statusCode: 200,
      },
    ],
  ]);

  resolvePath(path: string): UrlRegistryRecord {
    const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    const match = this.registry.get(path) || this.registry.get(normalized);

    if (match) {
      return match;
    }

    // Default route owner rule: new feature routes go to Next.js; unknown legacy paths fall back to WordPress
    if (
      path === '/' ||
      path === '' ||
      path.startsWith('/search') ||
      path.startsWith('/api') ||
      path.startsWith('/enterprise') ||
      path.startsWith('/dashboard') ||
      path.startsWith('/claim') ||
      path.startsWith('/biz')
    ) {
      return {
        id: 'dynamic-next',
        path,
        owner: 'next',
        migrationState: 'completed',
        statusCode: 200,
      };
    }

    return {
      id: 'default-wp-fallback',
      path,
      owner: 'wordpress',
      migrationState: 'legacy_wp',
      statusCode: 200,
    };
  }

  registerUrl(record: UrlRegistryRecord): UrlRegistryRecord {
    this.registry.set(record.path, record);
    return record;
  }
}

