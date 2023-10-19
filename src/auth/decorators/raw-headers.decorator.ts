import { InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const RawHeaders = createParamDecorator(
    (data,ctx:ExecutionContextHost)=>{
    
        const req = ctx.switchToHttp().getRequest(); 
        if(!req) throw new InternalServerErrorException('problem in decorator headers')
    
        return req.rawHeaders
    }
)