import { Injectable, InternalServerErrorException, Logger, BadRequestException, NotFoundException} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      
    const producto = this.productRepository.create(createProductDto)
    await this.productRepository.save(producto)

    return producto
    } catch (error) {
      this.handleDbExcepcion(error)
    }
  }

  
  async findAll(paginationDto:PaginationDto) {
    const {limit=10, offset=0} = paginationDto
    const products=await this.productRepository.find({
      take:limit,
      skip:offset
      //todo: relaciones
    })
    return products;
  }

  findOne(id: string) {
    return this.findById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const producto = await this.findById(id)
    
    await this.productRepository.remove(producto)
    
    return `This product with id ${id} has been removed`;
  }

  private handleDbExcepcion(error:any){
    
    if(error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Ayuda!!')
  }

  private async findById(id:string){
    
      const producto = await this.productRepository.findOneBy({id})
      if( !producto )
         throw new NotFoundException(`Product with id ${ id } not found`)
     
      return producto
    
  }
}
