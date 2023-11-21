import { StatusCodes } from "http-status-codes";
import Messages from '../models/messages';
import User from "../models/user";
import { RequestHandler } from "express";
import { io } from "../app";

export const createMessage: RequestHandler = async (req, res, next) => {
	const { userId } = req.session;
	const { message } = req.body;
  
	try {
	  if (!message.length) {
		return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Message required' });
	  }
  
	  const user = await User.findById(userId);
  
	  if (user) {
		const newMessage = await Messages.create({
		  message,
		  group: user.group,
		  createdBy: userId,
		});
  
		const populatedMessage = await Messages.populate(newMessage, { path: 'createdBy' });
  
		io.emit('new_message', populatedMessage);
  
		return res.status(StatusCodes.CREATED).json(populatedMessage);
	  }
	} catch (error) {
	  next(error);
	}
  };
  

export const getAllMessages: RequestHandler = async (req, res, next) => {
	const { userId } = req.session;

	try {
		const user = await User.findById(userId);

		const messages = await Messages.find({ group: user?.group }).populate('createdBy')

		res.status(StatusCodes.OK).json(messages);
	} catch (error) {
		next(error);
	}
}
