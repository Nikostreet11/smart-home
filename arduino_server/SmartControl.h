#ifndef SMART_CONTROL_H_
#define SMART_CONTROL_H_

#include <WString.h>
#include "Control.h"

class SmartControl
{
public:
	// destructor
	virtual ~SmartControl();

	// operations
	virtual Control::Type getType() = 0;
	virtual String getStringType() const = 0;
	
	// getters / setters
	String getId() const;
	//bool isActive() const;
	void setActive(bool active);
	
protected:
	// constructors
	SmartControl(String id);
	//SmartControl(SmartControl* origin);
	
	// variables
	String id;
	bool active;
};

#endif /* SMART_CONTROL_H_ */
