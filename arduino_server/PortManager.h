#ifndef PORT_MANAGER_H_
#define PORT_MANAGER_H_

#include <SPI.h>
#include <LinkedPointerList.h>
#include "ArduinoPort.h"

class PortManager
{
public:
	// constructor
	PortManager();
	
	// destructor
	virtual ~PortManager();

	// operations
	void debug();
	bool isAvailable(const String& portName);
	bool isLocked(const String& portName);
	bool lock(const String& portName);
	bool unlock(const String& portName);
	bool turnOn(const String& portName);
	bool turnOff(const String& portName);

	// getters / setters
	LinkedPointerList<ArduinoPort>& getAvailablePorts();
	
private:
	// internal
	int check(const String& portName, LinkedPointerList<ArduinoPort>& list);
	void orderedAdd(ArduinoPort* port, LinkedPointerList<ArduinoPort>& list);
	
	// resources
	LinkedPointerList<ArduinoPort> ports;
	LinkedPointerList<ArduinoPort> availablePorts;
};

#endif /* PORT_MANAGER_H_ */
