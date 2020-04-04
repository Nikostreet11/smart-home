#include "PortManager.h"

// constructor
PortManager::PortManager()
{
	int startingPorts[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21};
	
	for (int index = 0; index < sizeof(startingPorts) / sizeof(int); index++)
	{
		ArduinoPort* port = new ArduinoPort(startingPorts[index]);
		pinMode(port->getNumber(), OUTPUT);
		ports.add(port);
		availablePorts.add(port);
	}
}

// destructor
PortManager::~PortManager()
{
}

// operations
void PortManager::debug()
{
	Serial.print("ports size: ");
	Serial.println(ports.size());
	
	Serial.print("ports: |");
	for (int index = 0; index < ports.size(); index++)
	{
		Serial.print(ports.get(index)->getNumber());
		Serial.print("|");
	}
	Serial.println();
	
	Serial.print("available ports: |");
	for (int index = 0; index < availablePorts.size(); index++)
	{
		Serial.print(availablePorts.get(index)->getNumber());
		Serial.print("|");
	}
	Serial.println();
}

bool PortManager::isAvailable(const String& portName)
{
	if (portName == "none" || check(portName, availablePorts) != -1)
	{
		return true;
	}

	return false;
}

bool PortManager::isLocked(const String& portName)
{
	if (check(portName, ports) != -1 && check(portName, availablePorts) == -1)
	{
		return true;
	}

	return false;
}

bool PortManager::lock(const String& portName)
{
	if (portName == "none")
	{
		return true;
	}
	
	int index = check(portName, availablePorts);
	
	if (index != -1)
	{
		availablePorts.remove(index);
		return true;
	}
	
	return false;
}

bool PortManager::unlock(const String& portName)
{
	if (portName == "none")
	{
		return true;
	}
	
	int index1 = check(portName, ports);
	
	if (index1 != -1)
	{
		int index2 = check(portName, availablePorts);
		
		if (index2 == -1)
		{
			ArduinoPort* port = ports.get(index1);
			digitalWrite(port->getNumber(), LOW);
			orderedAdd(port, availablePorts);
			return true;
		}
	}
	
	return false;
}

bool PortManager::turnOn(const String& portName)
{
	if (isLocked(portName))
	{
		int index = check(portName, ports);
		digitalWrite(ports.get(index)->getNumber(), HIGH);
		return true;
	}

	return false;
}

bool PortManager::turnOff(const String& portName)
{
	if (isLocked(portName))
	{
		int index = check(portName, ports);
		digitalWrite(ports.get(index)->getNumber(), LOW);
		return true;
	}

	return false;
}

// getters / setters
LinkedPointerList<ArduinoPort>& PortManager::getAvailablePorts()
{
	return availablePorts;
}

// internal
int PortManager::check(const String& portName, LinkedPointerList<ArduinoPort>& list)
{
	for (int index = 0; index < list.size(); index++)
	{
		if (list.get(index)->getName() == portName)
		{
			return index;
		}
	}

	return -1;
}

void PortManager::orderedAdd(ArduinoPort* port, LinkedPointerList<ArduinoPort>& list)
{
	int index = 0;

	while (index < list.size() && list.get(index)->getNumber() < port->getNumber())
	{
		index++;
	}

	list.add(index, port);
}
