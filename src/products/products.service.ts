import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}


  // Create Product
  async create(createProductDto: CreateProductDto): Promise<{message: string, product: Product}> {
    const newProduct = this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);
    return {message: 'Berhasil Menambahkan Product', product: newProduct}
  }

  // Find All Product
  async findAll(): Promise<{message: string; product: Product[]}> {
      const products = await this.productRepository.find();

      if(products.length < 1) {
        throw new NotFoundException('Belum Ada Produk Tersedia Saat Ini.')
      } else {
        return {
          message : 'BERHASIL MENDAPATKAN PRODUK',
          product : products 
        }
      }
  } 

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  // Remove Product
  async remove(id: string): Promise<{ message: string; product: Product }> {
    try {
      const product = await this.productRepository.findOneBy({ id });
  
      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
  
      await this.productRepository.remove(product);
  
      return {
        message: 'Product removed successfully',
        product: product,
      };
    } catch (error) {
      if (error) {
        throw new BadRequestException('Invalid ID format, Mohon Cek Kembali');
      }
  
      throw new InternalServerErrorException('Terjadi Error Saat Menghapus Produk');
    }
  }
  
}
