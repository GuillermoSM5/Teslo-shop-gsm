import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class SeedService {

constructor(
  private readonly productsService: ProductsService
){}

  async runSeed(user:User) {
    await  this.insertNewProducts(user);
    return `This action returns all seed`;
  }
  
  private async insertNewProducts(user:User){
    await this.productsService.deleteAllProducts()
    
    const seedProducts = initialData.products;

    const insertPromises = []

    // seedProducts.forEach(product => {
    //   insertPromises.push(this.productsService.create(product,user))
    // })

    await Promise.all(insertPromises);

    return true 
  }
}
