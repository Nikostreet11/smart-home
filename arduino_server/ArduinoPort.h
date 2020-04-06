#ifndef ARDUINO_PORT_H_
#define ARDUINO_PORT_H_

#include <WString.h>

class ArduinoPort
{
public:
	// constructor
	ArduinoPort(int number);
	
	// destructor
	virtual ~ArduinoPort();
	
	// getters / setters
	int getNumber() const;
	const String& getName() const;
	bool isActive() const;
	void setActive(bool active);
	
private:
	// variables
	int number;
	String name;
	bool active;
};

#endif /* ARDUINO_PORT_H_ */
