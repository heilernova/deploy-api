import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { Framework, FRAMEWORK_LIST, IAppCreate, RUNNING_ON_LIST, RunningOn, RUNTIME_ENVIRONMENT_LIST, RuntimeEnvironment } from "src/models/apps";

export class CreateAppDto implements IAppCreate {
    @IsString()
    @IsNotEmpty()
    domain!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    process_name!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    startup_file?: string | null;

    @IsIn(FRAMEWORK_LIST)
    @IsOptional()
    framework!: Framework | null;

    @IsIn(RUNNING_ON_LIST)
    @IsOptional()
    running_on!: RunningOn | null;

    @IsIn(RUNTIME_ENVIRONMENT_LIST)
    @IsOptional()
    runtime_environment!: RuntimeEnvironment | null;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    url!: string | null;

    @IsObject()
    @IsOptional()
    repository!: any | null;

    @IsObject()
    @IsOptional()
    env!: { [key: string] : string }

    @IsString({ each: true })
    @IsOptional()
    ignore!: string[];
}