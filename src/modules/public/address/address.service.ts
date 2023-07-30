import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from '../../../dtos/address';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from 'src/models';

@Injectable()
export class AddressService {
  constructor(@InjectModel(Address) private addressModel: typeof Address) {}

  async create(createAddressDto: CreateAddressDto) {
    return await this.addressModel.create(createAddressDto);
  }

  async findAll() {
    const addresses = await this.addressModel.findAll();

    if (!addresses.length) throw new BadRequestException('No addresses found.');

    return addresses;
  }

  async findOne(id: number) {
    const address = await this.addressModel.findOne({ where: { id } });

    if (!address) throw new BadRequestException('Address not found.');

    return address;
  }

  async remove(id: number) {
    const address = await this.addressModel.findOne({ where: { id } });

    if (!address) throw new BadRequestException('Address not found.');

    address.destroy();

    return address;
  }
}
