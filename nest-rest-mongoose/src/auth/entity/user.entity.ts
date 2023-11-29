import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  hash: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
