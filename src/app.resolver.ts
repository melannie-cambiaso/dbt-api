import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello DBT API!';
  }

  @Query(() => String)
  health(): string {
    return 'API is running properly';
  }
}
