#include "ArduinoPort.h"

// constructor
ArduinoPort::ArduinoPort(int number) :
		number(number),
		active(false)
{
	name = "port_" + String(number);
}

// destructor
ArduinoPort::~ArduinoPort()
{
}

// getters / setters
int ArduinoPort::getNumber() const
{
	return number;
}

const String& ArduinoPort::getName() const
{
	return name;
}

bool ArduinoPort::isActive() const
{
	return active;
}
